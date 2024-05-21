import { getAllProducts } from "@/lib/actions"
import ProductCard from "./ProductCard";

const Trending = async () => {
  const allProducts = await getAllProducts();

  return (
    <>
      <section className="trending-section">
        <h2 className="section-text">Trending</h2>

      <div className="flex justify-between">
      {allProducts?.map((product) => (
        <div key={product._id} className="flex flex-wrap gap-x-8 gap-y-16">
          <ProductCard key={product._id} product={product}/>
        </div>
      ))}
      </div>
        
      </section>
    </>
  )
}

export default Trending