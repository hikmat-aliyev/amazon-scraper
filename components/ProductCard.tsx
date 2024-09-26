import { Product } from '@/types';
import Image from 'next/image';
import Link from 'next/link'; 

interface Props {
  product: Product
}

const ProductCard = ({ product }: Props) => {
  return (
    <Link 
      href={`/products/${product._id}`}
      className="product-card">
      <div className="product-card_img-container">
        <Image 
          src={product.image}
          alt={product.title}
          width={200}
          height={200}
          className="product-card_img"
        />
      </div>
      
      <div className="flex flex-col gap-3">
        <h3 className="product-title">{product.title}</h3>

        <div className="flex justify-between items-center">
          <p className="text-orange-600 text-xs font-semibold">
            {product.star} out of 5 stars
          </p>

          <p className="text-black text-lg font-semibold">
            <span>{product?.currency}</span>
            <span>{product?.currentPrice}</span>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;