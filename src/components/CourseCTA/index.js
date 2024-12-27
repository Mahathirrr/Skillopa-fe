import React from "react";
import { useRouter } from "next/router";
import { useSelector, useDispatch } from "react-redux";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

import Button from "src/components/Button";
import { addToCart, addToWishlist, removeFromWishlist } from "redux/slice/auth";
import { createPayment } from "redux/slice/payment";

const CourseCTA = (props) => {
  const { course } = props;
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    isAuthenticated,
    profile,
    addRemoveCart: { loading: addRemoveCartLoading },
    addRemoveWishlist: { loading: addRemoveWishlistLoading },
  } = useSelector((state) => state.auth);

  const {
    createPayment: { loading: paymentLoading },
  } = useSelector((state) => state.payment);

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      return router.push("/login");
    }

    try {
      const response = await dispatch(createPayment(course._id)).unwrap();
      if (response.paymentLink) {
        window.location.href = response.paymentLink;
      }
    } catch (error) {
      console.error("Payment creation failed:", error);
    }
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) return router.push("/login");
    dispatch(addToCart(course._id));
  };

  const handleGotoCart = () => router.push("/cart");

  const handleAddToWishlist = () => {
    if (!isAuthenticated) return router.push("/login");
    dispatch(addToWishlist(course._id));
  };

  const handleRemoveFromWishlist = () =>
    dispatch(removeFromWishlist(course._id));

  const handleLearnClick = () => router.push(`/course/${course.slug}/learn`);

  const purchaseAndLearnCTA = () => {
    if (
      isAuthenticated &&
      profile?.enrolledCourses.some((c) => c.course === course._id)
    ) {
      return (
        <Button
          label="Go to course"
          className="w-full py-3 font-semibold"
          onClick={handleLearnClick}
        />
      );
    }

    if (course.pricing === "Free") {
      if (!isAuthenticated || !profile?.cart.includes(course._id)) {
        return (
          <Button
            label="Enroll Now"
            className="w-full py-3 font-semibold"
            loading={addRemoveCartLoading}
            onClick={handleAddToCart}
          />
        );
      }
    } else {
      return (
        <div className="flex flex-col gap-2 w-full">
          <Button
            label="Buy Now"
            className="w-full py-3 font-semibold"
            loading={paymentLoading}
            onClick={handleBuyNow}
            startIcon={<ShoppingCartIcon />}
          />
          {!isAuthenticated || !profile?.cart.includes(course._id) ? (
            <Button
              label="Add to Cart"
              variant="outlined"
              className="w-full py-3 font-semibold"
              loading={addRemoveCartLoading}
              onClick={handleAddToCart}
            />
          ) : (
            <Button
              label="Go to Cart"
              variant="outlined"
              className="w-full py-3 font-semibold"
              onClick={handleGotoCart}
            />
          )}
        </div>
      );
    }

    if (profile?.cart.includes(course._id)) {
      return (
        <Button
          label="Go to cart"
          className="w-full py-3 font-semibold"
          loading={addRemoveCartLoading}
          onClick={handleGotoCart}
        />
      );
    }

    return null;
  };

  const wishlistCTA = () => {
    if (profile?.enrolledCourses.some((c) => c.course === course._id)) {
      return null;
    }

    if (!isAuthenticated || !profile?.wishlist.includes(course._id)) {
      return (
        <Button
          variant="outlined"
          onClick={handleAddToWishlist}
          loading={addRemoveWishlistLoading}
        >
          <FavoriteBorderIcon />
        </Button>
      );
    }

    if (profile?.wishlist.includes(course._id)) {
      return (
        <Button
          variant="outlined"
          onClick={handleRemoveFromWishlist}
          loading={addRemoveWishlistLoading}
        >
          <FavoriteIcon />
        </Button>
      );
    }

    return null;
  };

  return (
    <div className="flex gap-3 my-3">
      {purchaseAndLearnCTA()}
      {wishlistCTA()}
    </div>
  );
};

export default CourseCTA;
