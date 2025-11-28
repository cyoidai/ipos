import { Button } from "react-bootstrap";
import { Form } from "react-bootstrap";

export default function Payment() {
  return (
    <div className='m-1'>
      <div className='d-grid gap-1 p-1' style={{
        justifyContent: 'space-between',
        gridTemplateRows: '1fr 1fr',
        gridTemplateColumns: '1fr 1fr 1fr 1fr'
      }}>
        <Button className='w-100 py-3'>Check</Button>
        <Button className='w-100 py-3'>Cash</Button>
        <Button className='w-100 py-3'>Credit card</Button>
        <Button className='w-100 py-3'>Debit card</Button>
      </div>
    </div>
  );
}
