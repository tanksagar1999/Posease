import React from "react";
import { Row, Col } from "antd";
import { PageHeader } from "../../../components/page-headers/page-headers";
import { Cards } from "../../../components/cards/frame/cards-frame";
import { Main } from "../../styled";
import "../option.css";

const PreviewVariant = () => {
  return (
    <>
      <Main>
        {/* <PageHeader
          ghost
          size="small"
          title={
            <>
              <Tabs
                type="card"
                activeKey={activeTab}
                size="small"
                onChange={changeTab}
              >
                <TabPane
                  tab="preview"
                  key="PREVIEW"
                  className="ant-tabs-tab-active"
                ></TabPane>
              </Tabs>
            </>
          }
        />
        <Row gutter={15}>
          <Col md={24}>
            <Cards headless>
              <UserTableStyleWrapper>
                <div className="contact-table">
                  <TableWrapper className="table-responsive">
                    <Table
                      rowSelection={{
                        type: selectionType,
                        ...rowSelection,
                      }}
                      rowKey="id"
                      size="small"
                      dataSource={dataSource}
                      columns={columns}
                      fixed={true}
                      scroll={{ x: 800 }}
                      pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        total: dataSource.length,
                      }}
                    />
                  </TableWrapper>
                </div>
              </UserTableStyleWrapper>
            </Cards>
          </Col>
        </Row> */}
      </Main>
    </>
  );
};

export default PreviewVariant;
