// Write your code here
import './index.css'
import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

const apiStatusObject = {
  loading: 'LOADING',
  success: 'SUCCESS',
  failure: 'FAILURE',
}
class ProductItemDetails extends Component {
  state = {apiStatus: apiStatusObject.loading, productItemDetails: '', count: 1}

  componentDidMount() {
    this.getProductDetails()
  }

  onReroute = () => {
    const {history} = this.props
    history.replace('/products')
  }

  onIncrementQuantity = () => {
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  onDecrementQuantity = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({count: prevState.count - 1}))
    }
  }

  onLoadingView = () => (
    <div data-testid="loader" className="products-details-loader-container">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  onFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        alt="failure view"
      />
      <h1>Product Not Found</h1>
      <button onClick={this.onReroute} type="button">
        Continue Shopping
      </button>
    </div>
  )

  onSuccessView = () => {
    const {productItemDetails, count} = this.state
    const {
      id,
      imageUrl,
      title,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
      similarProducts,
    } = productItemDetails
    return (
      <>
        <Header />
        <div key={id} className="product-details-bg-container">
          <div className="product-details-card-container">
            <img src={imageUrl} alt="product" className="product-image" />
            <div className="product-info-container">
              <h1 className="product-title">{title}</h1>
              <p className="product-price">Rs {price}/-</p>
              <div className="ratings-and-reviews-container">
                <div className="rating-container">
                  <p className="rating-item">{rating}</p>
                  <img
                    alt="star"
                    src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                    className="star-image"
                  />
                </div>
                <p className="review-item">{totalReviews} reviews</p>
              </div>
              <p className="product-description">{description}</p>
              <p className="product-available">
                Available:{' '}
                <p className="product-available-span">{availability}</p>
              </p>
              <p className="product-available">
                Brand: <p className="product-available-span">{brand}</p>
              </p>
              <div className="product-quantity-container">
                <button
                  onClick={this.onDecrementQuantity}
                  className="quantity-button"
                  type="button"
                  data-testid="minus"
                >
                  <BsDashSquare className="quantity-icon" />
                </button>
                <p className="quantity-count">{count}</p>
                <button
                  onClick={this.onIncrementQuantity}
                  className="quantity-button"
                  type="button"
                  data-testid="plus"
                >
                  <BsPlusSquare className="quantity-icon" />
                </button>
              </div>
              <button type="button" className="add-to-cart-button">
                ADD TO CART
              </button>
            </div>
          </div>
        </div>
        <h1>Similar Products</h1>
        <div className="similar-products-container">
          <div className="similar-products-card-container">
            {similarProducts.map(i => (
              <SimilarProductItem key={i.id} similarProductItem={i} />
            ))}
          </div>
        </div>
      </>
    )
  }

  loadProductDetails = () => {
    const {apiStatus} = this.state
    let p
    switch (apiStatus) {
      case 'LOADING':
        p = this.onLoadingView()
        break
      case 'SUCCESS':
        p = this.onSuccessView()
        break
      case 'FAILURE':
        p = this.onFailureView()
        break
      default:
        break
    }
    return p
  }

  getProductDetails = async () => {
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(`https://apis.ccbp.in/products/${id}`, options)
    const data = await response.json()
    if (response.ok) {
      const fetchedData = {
        id: data.id,
        imageUrl: data.image_url,
        title: data.title,
        price: data.price,
        description: data.description,
        brand: data.brand,
        totalReviews: data.total_reviews,
        rating: data.rating,
        availability: data.availability,
        similarProducts: data.similar_products.map(i => ({
          id: i.id,
          imageUrl: i.image_url,
          title: i.title,
          style: i.style,
          price: i.price,
          description: i.description,
          brand: i.brand,
          totalReviews: i.total_reviews,
          rating: i.rating,
          availability: i.availability,
        })),
      }
      console.log(fetchedData)
      this.setState(
        {productItemDetails: fetchedData, apiStatus: apiStatusObject.success},
        this.loadProductDetails,
      )
    }
    if (response.status === 404) {
      this.setState({apiStatus: apiStatusObject.failure}, this.onFailureView)
    }
  }

  render() {
    return this.loadProductDetails()
  }
}
export default ProductItemDetails
