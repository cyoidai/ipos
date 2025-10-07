
export default async function Home() {

  return (
    <main className="m-4">
      <h1 className="mb-3">Organizations</h1>
      <div className="d-flex justify-content-end">
        <button
          type="button"
          className="btn btn-primary"
          data-bs-toggle="modal"
          data-bs-target="#newOrganizationModal"
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
        <tbody>
          <tr>
            <td>organizaiton 1</td>
            <td>some description here</td>
            <td className="d-flex gap-2">
              <button className="btn btn-primary p-1">Edit</button>
              <button className="btn btn-danger p-1">Delete</button>
            </td>
          </tr>
          <tr>
            <td className="text-center" colSpan={3}>No organizations to display...</td>
          </tr>
        </tbody>
      </table>

      <div className="modal" id="newOrganizationModal" tabIndex={-1} aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Create new organization</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label" htmlFor="name">Organization name</label>
                  <input className="form-control" type="text" name="name" id="name" />
                </div>
                <div className="mb-3">
                  <label htmlFor="description">Description</label>
                  <textarea className="form-control" name="description" id="description" />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
              <button type="button" className="btn btn-primary">Ok</button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
