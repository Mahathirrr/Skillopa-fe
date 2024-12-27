import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import CircularProgress from "@mui/material/CircularProgress";

import Layout from "src/components/Layout";
import { getInstructorEarnings } from "redux/slice/payment";

const columns = [
  {
    field: "orderId",
    headerName: "Order ID",
    width: 200,
  },
  {
    field: "course",
    headerName: "Course",
    width: 300,
    valueGetter: (params) => params.row.course.title,
  },
  {
    field: "user",
    headerName: "Student",
    width: 200,
    valueGetter: (params) => params.row.user.name,
  },
  {
    field: "amount",
    headerName: "Amount",
    width: 150,
    valueGetter: (params) => `IDR ${params.row.amount.toLocaleString()}`,
  },
  {
    field: "createdAt",
    headerName: "Date",
    width: 200,
    valueGetter: (params) =>
      new Date(params.row.createdAt).toLocaleDateString(),
  },
];

const Earnings = () => {
  const dispatch = useDispatch();
  const { earnings } = useSelector((state) => state.payment);

  useEffect(() => {
    dispatch(getInstructorEarnings());
  }, [dispatch]);

  if (earnings.loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-96">
          <CircularProgress />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-6">Earnings</h1>

        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-2">Total Earnings</h2>
          <p className="text-3xl font-bold text-primary">
            IDR {earnings.data?.totalEarnings?.toLocaleString()}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold p-6 border-b">
            Payment History
          </h2>
          <div style={{ height: 400, width: "100%" }}>
            <DataGrid
              rows={earnings.data?.payments || []}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5]}
              getRowId={(row) => row.orderId}
              disableSelectionOnClick
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Earnings;
