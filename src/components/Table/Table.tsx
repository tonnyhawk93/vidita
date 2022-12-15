import React, { useEffect, useMemo, useRef, useState } from "react";
import type { Document } from "../../types";
import { fetchDocuments } from "../../store/documentsSlice";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { SearchOutlined } from "@ant-design/icons";
import type { InputRef } from "antd";
import { Button, Input, Space, Table } from "antd";
import type { ColumnsType, ColumnType } from "antd/es/table";
import type { FilterConfirmProps } from "antd/es/table/interface";
import Highlighter from "react-highlight-words";

const getTotalCount = ({ qty, sum, currency }: Document) =>
  `${(qty * sum).toFixed(2)} ${currency}`;

type Props = {
  setIds: (params: string[]) => void;
};

const MyTable: React.FC<Props> = ({ setIds }) => {
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef<InputRef>(null);
  const dispatch = useAppDispatch();
  const documents = useAppSelector((state) => state.documents.documents);

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: Document[]) => {
      setIds(selectedRows.map((row) => row.id));
    },
  };

  const [totalQty, totalVolume] = useMemo(() => {
    const totalQty = documents.reduce((acc, next) => acc + next.qty, 0);
    const totalVolume = documents.reduce((acc, next) => acc + next.volume, 0);

    return [totalQty, totalVolume];
  }, [documents]);

  const enrichedDocuments = useMemo(() => {
    return documents.map((doc) => ({
      ...doc,
      total: getTotalCount(doc),
      key: doc.id,
    }));
  }, [documents]);

  useEffect(() => {
    dispatch(fetchDocuments());
  }, [dispatch]);

  const handleSearch = (
    selectedKeys: string[],
    confirm: (param?: FilterConfirmProps) => void,
    dataIndex: keyof Document
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText("");
  };

  const getColumnSearchProps = (
    dataIndex: keyof Document
  ): ColumnType<Document> => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
      close,
    }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() =>
            handleSearch(selectedKeys as string[], confirm, dataIndex)
          }
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() =>
              handleSearch(selectedKeys as string[], confirm, dataIndex)
            }
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => {
              clearFilters && handleReset(clearFilters);
              handleSearch([""], confirm, dataIndex);
            }}
            size="small"
            style={{ width: 90 }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns: ColumnsType<Document> = [
    {
      title: "Статус",
      dataIndex: "status",
      key: "id",
    },
    {
      title: "Сумма",
      dataIndex: "sum",
      key: "id",
      ...getColumnSearchProps("sum"),
    },
    {
      title: "Количество",
      dataIndex: "qty",
      key: "id",
      ...getColumnSearchProps("qty"),
    },
    {
      title: "Объём",
      dataIndex: "volume",
      key: "id",
      ...getColumnSearchProps("volume"),
    },
    {
      title: "Название",
      dataIndex: "name",
      key: "id",
      ...getColumnSearchProps("name"),
    },
    {
      title: "Дата доставки",
      dataIndex: "delivery_date",
      key: "id",
      ...getColumnSearchProps("delivery_date"),
    },
    {
      title: "Валюта",
      dataIndex: "currency",
      key: "id",
      ...getColumnSearchProps("currency"),
    },
    {
      title: "Всего",
      dataIndex: "total",
      key: "id",
    },
  ];
  return (
    <Table
      dataSource={enrichedDocuments}
      columns={columns}
      pagination={false}
      rowSelection={{
        type: "checkbox",
        ...rowSelection,
      }}
      footer={() => `Общий обьем: ${totalVolume} Общее количество: ${totalQty}`}
    />
  );
};

export default MyTable;
