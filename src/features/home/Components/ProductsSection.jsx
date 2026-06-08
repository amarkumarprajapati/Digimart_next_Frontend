 
import { Card, Button, Rate } from 'antd';
import { HeartOutlined } from '@ant-design/icons';

const ProductsSection = () => {
  const products = [
    { id: 1, name: 'Premium Wireless Headphones', price: 299.99, rating: 4.8, img: '/product1.jpg' },
    { id: 2, name: 'Smart Fitness Watch', price: 199.99, rating: 4.7, img: '/product2.jpg' },
    { id: 3, name: 'Ultra-Slim Laptop', price: 1299.99, rating: 4.9, img: '/product3.jpg' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-3xl font-bold mb-8">Popular Products</h2>
      <div className="grid grid-cols-3 gap-8">
        {products?.map(product => (
          <Card key={product.id} hoverable cover={<img alt={product.name} src={product.img} className="h-64 object-cover" />}>
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <HeartOutlined className="text-xl hover:text-red-500 cursor-pointer" />
            </div>
            <Rate disabled defaultValue={product.rating} className="mb-2" />
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">${product.price}</span>
              <Button type="primary" className='font-medium'>Add to Cart</Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ProductsSection;
