'use client';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import CreateOrganizationModal from './_CreateOrganizationModal';
import useFetch from '@/useFetch';

function deleteOrg(id: number) {
  axios.delete('/api/v1/org', {
    data: { id }
  }).then((res) => {

  }).catch((error) => {

  });
}

function OrgTableBody() {

  const { data, isLoading, error } = useFetch('/api/v1/org');
  const colSpan = 3;

  if (isLoading)
    return (
      <tbody><tr><td className="text-center" colSpan={colSpan}>Loading...</td></tr></tbody>
    );
  if (error)
    return (
      <tbody><tr><td className="text-center" colSpan={colSpan}>Internal server error</td></tr></tbody>
    );
  if (data.length === 0)
    return (
      <tbody><tr><td className="text-center" colSpan={colSpan}>No organizations found</td></tr></tbody>
    );
  return (
    <tbody>
      {
        data.map((org, i) => {
          return (
            <tr key={i}>
              <td><Link href={'/org/' + org.id}>{org.name}</Link></td>
              <td>{org.description}</td>
              <td className="d-flex gap-2">
                <button className="btn btn-primary">Edit</button>
                <button className="btn btn-danger" onClick={() => deleteOrg(org.id)}>Delete</button>
              </td>
            </tr>
          );
        })
      }
    </tbody>
  );
}

export default function Page() {

  return (
    <main className="m-4">
      <h1 className="mb-3">Organizations</h1>
      <div className="d-flex justify-content-end">
        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#createOrganizationModal"
        >
          New organization
        </button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <OrgTableBody />
      </table>

      <CreateOrganizationModal id="createOrganizationModal" />
    </main>
  );
}
