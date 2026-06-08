import { Tabs, List, Descriptions } from "antd";
import { CheckCircleOutlined } from "@ant-design/icons";

const { TabPane } = Tabs;

const ProductDetailsDec = ({ currentProduct }) => {
  const {
    description = "No description available.",
    features = [],
    specifications = {},
    warranty = "No warranty information available.",
    shipping = "No shipping information available.",
  } = currentProduct;

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        About this item
      </h2>
      <Tabs defaultActiveKey="1" type="card" className="product-details-tabs">
        <TabPane tab="Overview" key="1">
          <div className="py-6">
            <p className="text-gray-600 leading-relaxed mb-6">{description}</p>
            {features.length > 0 && (
              <>
                <h3 className="text-lg font-semibold text-gray-700 mb-3">
                  Key Features
                </h3>
                <List
                  dataSource={features}
                  renderItem={(item) => (
                    <List.Item className="!border-none !p-0">
                      <CheckCircleOutlined className="text-green-500 mr-2" />
                      {item}
                    </List.Item>
                  )}
                  size="small"
                />
              </>
            )}
          </div>
        </TabPane>

        <TabPane tab="Specifications" key="2">
          <div className="py-6">
            <Descriptions bordered column={1} size="small">
              {Object.entries(specifications).map(([key, value]) => (
                <Descriptions.Item label={key} key={key}>
                  {value}
                </Descriptions.Item>
              ))}
            </Descriptions>
          </div>
        </TabPane>

        <TabPane tab="Warranty & Shipping" key="3">
          <div className="py-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Warranty
              </h3>
              <p className="text-gray-600">{warranty}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Shipping
              </h3>
              <p className="text-gray-600">{shipping}</p>
            </div>
          </div>
        </TabPane>
      </Tabs>
    </div>
  );
};

export default ProductDetailsDec;
