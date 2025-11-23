import { Modal, Button } from 'react-bootstrap';

export default function ConfirmationModal({
  show,
  setShow,
  onAccept,
  onReject,
  children
}: {
  show: boolean,
  setShow: (show: boolean) => void,
  onAccept?: () => void,
  onReject?: () => void,
  children: React.ReactNode
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
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleReject}>Cancel</Button>
        <Button variant="primary" onClick={handleAccept}>Ok</Button>
      </Modal.Footer>
    </Modal>
  );
}
