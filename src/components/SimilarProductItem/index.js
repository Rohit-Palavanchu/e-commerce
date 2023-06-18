// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {similarProductItem} = props
  const {imageUrl, title, brand, price, rating} = similarProductItem
  return (
    <div className="similar-image-card-container">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-product-image"
      />
      <p className="similar-product-title">{title}</p>
      <p className="similar-product-brand">by {brand}</p>
      <div className="similar-product-rating-and-review-container-1">
        <p className="similar-product-price">Rs {price}/-</p>
        <div className="similar-product-rating-container">
          <p>{rating}</p>
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="similar-product-rating-icon"
          />
        </div>
      </div>
    </div>
  )
}
export default SimilarProductItem
