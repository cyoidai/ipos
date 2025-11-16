import { Modal, Button } from 'react-bootstrap';

export default function ConfirmationModal({
  show,
  setShow,
  body,
  onAccept,
  onReject
}: {
  show: boolean,
  setShow: (show: boolean) => void,
  body: string,
  onAccept?: () => void,
  onReject?: () => void
}) {

  function handleAccept() {
    setShow(false);
    if (onAccept)
      onAccept();
  }

  function handleReject() {
    setShow(false);
    if (onReject)
      onReject();
  }

  return (
    <Modal show={show} onHide={handleReject}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm action</Modal.Title>
      </Modal.Header>
      <Modal.Body>{body}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleReject}>Cancel</Button>
        <Button variant="primary" onClick={handleAccept}>Ok</Button>
      </Modal.Footer>
    </Modal>
  );
}
