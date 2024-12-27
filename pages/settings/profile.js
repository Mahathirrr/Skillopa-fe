import React from "react";
import withAuth from "src/components/HOC/withAuth";
import Layout from "src/components/Layout";
import ProfileSettings from "src/components/ProfileSettings";

const ProfilePage = () => {
  return (
    <Layout>
      <ProfileSettings />
    </Layout>
  );
};

export default withAuth(ProfilePage);
