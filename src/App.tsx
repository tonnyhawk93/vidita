import React, { useState } from "react";
import type { Document } from "./types";
import { fetchCancelOrder } from "./store/documentsSlice";
import { useAppDispatch, useAppSelector } from "./hooks";
import { Button, Modal } from "antd";

import { Table } from "./components";

const buildModalMessage = (documents: Document[], selectedIds: string[]) => {
  const names = documents
    .filter((doc) => selectedIds.includes(doc.id))
    .map(({ name }) => name);

  return `Вы уверены что хотите аннулировать товар${
    names.length === 1 ? "" : "ы"
  } ${names.join(", ")}.`;
};

function App() {
  const dispatch = useAppDispatch();
  const documents = useAppSelector((state) => state.documents.documents);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    dispatch(fetchCancelOrder(selectedIds));
    setIsModalOpen(false);
    setSelectedIds([]);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="App">
      <Table setIds={setSelectedIds} />
      {selectedIds.length > 0 && (
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            margin: "1rem",
          }}
        >
          <Button onClick={showModal} type="primary">
            Аннулировать
          </Button>
        </div>
      )}
      <Modal
        title="Аннулировать заказ"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Применить"
        cancelText="Отклонить"
      >
        {buildModalMessage(documents, selectedIds)}
      </Modal>
    </div>
  );
}

export default App;
