import { Organization } from '@/org';
import { Role } from '@/role';
import useFetch from '@/useFetch';
import { ChangeEventHandler } from 'react';
import Form from 'react-bootstrap/Form';

export default function RoleSelect({
  org,
  value,
  onChange
}: {
  org: Organization,
  value?: string | number | readonly string[],
  onChange?: ChangeEventHandler<HTMLSelectElement>
}) {

  const { data, isLoading, error } = useFetch<Role[]>('/api/v1/role', { orgId: org.id });

  if (isLoading)
    return (
      <Form.Select>
        <option value={-1}>Loading roles...</option>
      </Form.Select>
    );

  if (error)
    return (
      <Form.Select>
        <option value={-1}>Error loading roles</option>
      </Form.Select>
    );

  if (!data || data.length === 0)
    return (
      <Form.Select value={value} onChange={onChange}>
        <option value={-1}>No roles found</option>
      </Form.Select>
    );

  return (
    <Form.Select value={value} onChange={onChange}>
      <option value={-1}></option>
      {
        data.map((role, i) => {
          return (
            <option key={i} value={role.id}>{role.name}</option>
          );
        })
      }
    </Form.Select>
  );
}
