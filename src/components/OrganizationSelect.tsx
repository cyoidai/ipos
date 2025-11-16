import useFetch from '@/useFetch';
import { Organization } from '@/types';
import Form from 'react-bootstrap/Form';

export default function OrganizationSelect({
  value,
  onChange
}: {
  value: number,
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}) {
  const { data, isLoading, error } = useFetch<Organization[]>('/api/v1/org');

  if (isLoading) {
    return (
      <Form.Select value={value} onChange={onChange}>
        <option value={-1}>Loading...</option>
      </Form.Select>
    );
  }
  if (error) {
    return (
      <Form.Select value={value} onChange={onChange}>
        <option value={-1}>Internal server error</option>
      </Form.Select>
    );
  }
  if (!data || data.length === 0) {
    return (
      <Form.Select value={value} onChange={onChange}>
        <option value={-1}>No organizations found</option>
      </Form.Select>
    );
  }
  return (
    <Form.Select value={value} onChange={onChange}>
      <option value={-1}></option>
      {
        data.map((org, i) => {
          return (
            <option key={i} value={org.id}>{org.name}</option>
          );
        })
      }
    </Form.Select>
  );
}
