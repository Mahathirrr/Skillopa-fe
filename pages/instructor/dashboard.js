import React from "react";
import withAuth from "src/components/HOC/withAuth";
import InstructorPageLayout from "src/components/InstructorPageLayout";
import InstructorDashboard from "src/components/InstructorDashboard";

const Dashboard = () => {
  return (
    <InstructorPageLayout>
      <InstructorDashboard />
    </InstructorPageLayout>
  );
};

export default withAuth(Dashboard);
