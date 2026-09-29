create type public.app_role as enum ('admin','user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;
create policy "Users see own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create sequence public.application_seq start 1001;

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  application_id text not null unique default ('CE-' || to_char(now(),'YYYY') || '-' || lpad(nextval('public.application_seq')::text, 5, '0')),
  first_name text not null,
  last_name text not null,
  date_of_birth date not null,
  gender text not null,
  phone text not null,
  email text not null,
  city text not null,
  cnic text,
  highest_qualification text not null,
  field_of_study text not null,
  institution_name text not null,
  has_work_experience boolean not null,
  total_experience text not null,
  previous_job_title text,
  previous_company text,
  key_responsibilities text,
  preferred_shift text not null,
  expected_salary integer not null,
  notice_period text not null,
  vacancy_source text not null,
  referral_name text,
  interest_reason text not null,
  career_goals text not null,
  resume_url text not null,
  resume_filename text,
  application_status text not null default 'New',
  hr_notes text,
  created_at timestamptz not null default now()
);
grant select, update on public.applications to authenticated;
grant all on public.applications to service_role;
alter table public.applications enable row level security;
create policy "Admins read applications" on public.applications for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "Admins update applications" on public.applications for update to authenticated using (public.has_role(auth.uid(),'admin')) with check (public.has_role(auth.uid(),'admin'));

create or replace function public.submit_application(payload jsonb)
returns text language plpgsql security definer set search_path = public
as $$
declare new_id text;
begin
  if length(coalesce(payload->>'first_name','')) < 1 or length(payload->>'first_name') > 100 then raise exception 'invalid first_name'; end if;
  if (payload->>'email') !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' then raise exception 'invalid email'; end if;
  if (payload->>'phone') !~ '^(03\d{9}|\+923\d{9})$' then raise exception 'invalid phone'; end if;
  if coalesce(payload->>'cnic','') <> '' and (payload->>'cnic') !~ '^\d{5}-\d{7}-\d$' then raise exception 'invalid cnic'; end if;
  if (payload->>'resume_url') !~ '^[A-Za-z0-9/_.-]+$' then raise exception 'invalid resume'; end if;
  insert into public.applications (
    first_name,last_name,date_of_birth,gender,phone,email,city,cnic,highest_qualification,field_of_study,institution_name,
    has_work_experience,total_experience,previous_job_title,previous_company,key_responsibilities,preferred_shift,expected_salary,
    notice_period,vacancy_source,referral_name,interest_reason,career_goals,resume_url,resume_filename)
  values (
    left(payload->>'first_name',100), left(payload->>'last_name',100), (payload->>'date_of_birth')::date, left(payload->>'gender',20),
    payload->>'phone', left(payload->>'email',255), left(payload->>'city',100), nullif(payload->>'cnic',''),
    left(payload->>'highest_qualification',50), left(payload->>'field_of_study',150), left(payload->>'institution_name',200),
    (payload->>'has_work_experience')::boolean, left(payload->>'total_experience',50),
    nullif(left(payload->>'previous_job_title',150),''), nullif(left(payload->>'previous_company',150),''), nullif(left(payload->>'key_responsibilities',2000),''),
    left(payload->>'preferred_shift',30), (payload->>'expected_salary')::integer, left(payload->>'notice_period',100),
    left(payload->>'vacancy_source',50), nullif(left(payload->>'referral_name',150),''),
    left(payload->>'interest_reason',2000), left(payload->>'career_goals',2000), payload->>'resume_url', left(payload->>'resume_filename',255))
  returning application_id into new_id;
  return new_id;
end $$;
revoke all on function public.submit_application(jsonb) from public;
grant execute on function public.submit_application(jsonb) to anon, authenticated;

alter publication supabase_realtime add table public.applications;

create policy "Anyone can upload resumes" on storage.objects for insert to anon, authenticated with check (bucket_id = 'resumes');
create policy "Admins read resumes" on storage.objects for select to authenticated using (bucket_id = 'resumes' and public.has_role(auth.uid(),'admin'));