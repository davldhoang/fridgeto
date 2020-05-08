import React from "react";

function ProfilePageHeader() {
  let pageHeader = React.createRef();

  return (
    <>
      <div
        style={{
          backgroundImage: "url(" + require("../assets/img/header.jpg") + ")",
        }}
        className="page-header page-header-xs"
        data-parallax={true}
        ref={pageHeader}
      >
        <div className="filter" />
      </div>
    </>
  );
}

export default ProfilePageHeader;
