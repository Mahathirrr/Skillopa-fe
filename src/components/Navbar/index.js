import React from "react";
import { useSelector } from "react-redux";
import Link from "next/link";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

import Logo from "../Logo";
import Searchbar from "../Searchbar";
import Submenu from "./components/Submenu";
import Button from "../Button";
import ProfileMenu from "./components/ProfileMenu";

export default function Navbar() {
  const { isAuthenticated, profile } = useSelector((state) => state.auth);
  const { profile: instructorProfile } = useSelector(
    (state) => state.instructor,
  );

  const renderLinks = () => {
    if (isAuthenticated) {
      return (
        <div className="hidden md:flex gap-8">
          {(profile?.role.includes("Instructor") || instructorProfile) && (
            <Link href="/instructor/courses">
              <a className="nav-link font-medium">Instructor</a>
            </Link>
          )}
          <Link href="/my-courses">
            <a className="nav-link font-medium">My Learning</a>
          </Link>
        </div>
      );
    }
  };

  const renderWishlistAndCart = () => {
    return (
      <div className="flex mx-5 gap-4">
        <Link href="/wishlist" passHref>
          <IconButton
            size="large"
            aria-label="wishlist"
            className="hover:bg-primary/10 transition-colors"
          >
            <Badge badgeContent={profile?.wishlist.length} color="primary">
              <FavoriteBorderIcon className="text-mainText" />
            </Badge>
          </IconButton>
        </Link>

        <Link href="/cart" passHref>
          <IconButton
            size="large"
            aria-label="shopping cart"
            className="hover:bg-primary/10 transition-colors"
          >
            <Badge badgeContent={profile?.cart.length} color="primary">
              <ShoppingCartOutlinedIcon className="text-mainText" />
            </Badge>
          </IconButton>
        </Link>
      </div>
    );
  };

  const renderAuthCTAs = () => {
    if (!isAuthenticated) {
      return (
        <div className="hidden md:flex gap-4">
          <Link href="/login" passHref>
            <Button
              label="Sign In"
              variant="outlined"
              className="rounded-full hover:bg-primary/10"
            />
          </Link>
          <Link href="/signup" passHref>
            <Button
              label="Sign Up"
              className="rounded-full bg-primary hover:bg-primary/90"
            />
          </Link>
        </div>
      );
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" className="bg-white shadow-sm">
        <Toolbar className="h-20 lg:px-24">
          <Logo variant="header" />
          <div className="hidden md:flex w-1/2 items-center">
            <Submenu />
            <Searchbar />
          </div>
          <Box sx={{ flexGrow: 1 }} />
          <div className="flex items-center">
            {renderLinks()}
            {renderWishlistAndCart()}
            {renderAuthCTAs()}
            {isAuthenticated && <ProfileMenu />}
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
