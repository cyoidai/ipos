'use state'

export default function Page() {
  return (
    <div>
      <button className="btn btn-success">Clock in</button>
      <button className="btn btn-danger">Clock out</button>
      <h2>Clock in/out history</h2>
      <table className="table">
        <thead>
          <th>Clock-in time</th>
          <th>Clock-out time</th>
          <th>Shift duration</th>
        </thead>
        <tbody>
          <tr>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
