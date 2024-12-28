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
import MobileMenu from "./components/MobileMenu";

export default function Navbar() {
  const { isAuthenticated, profile } = useSelector((state) => state.auth);
  const { profile: instructorProfile } = useSelector(
    (state) => state.instructor,
  );

  const renderLinks = () => {
    if (isAuthenticated) {
      return (
        <div className="hidden md:flex items-center gap-8">
          {(profile?.role.includes("Instructor") || instructorProfile) && (
            <Link href="/instructor/courses">
              <a className="nav-link font-comedik text-mainText hover:text-primary transition-colors">
                Instructor
              </a>
            </Link>
          )}
          <Link href="/my-courses">
            <a className="nav-link font-comedik text-mainText hover:text-primary transition-colors">
              My Learning
            </a>
          </Link>
        </div>
      );
    }
  };

  const renderWishlistAndCart = () => {
    return (
      <div className="flex items-center mx-5 gap-4">
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
        <div className="hidden md:flex items-center gap-4">
          <Link href="/login" passHref>
            <Button
              label="Sign In"
              variant="outlined"
              className="rounded-full hover:bg-primary/10 font-comedik text-mainText"
            />
          </Link>
          <Link href="/signup" passHref>
            <Button
              label="Sign Up"
              className="rounded-full bg-primary hover:bg-primary/90 font-comedik"
            />
          </Link>
        </div>
      );
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="sticky" className="bg-headerBg shadow-md">
        <Toolbar className="h-20 px-4 lg:px-24">
          <div className="flex items-center lg:hidden">
            <MobileMenu />
          </div>
          <div className="flex items-center gap-2">
            <Logo variant="header" />
            <h1 className="font-comedik text-2xl text-primary">Skillopa</h1>
          </div>
          <div className="hidden lg:flex flex-1 items-center justify-center max-w-4xl mx-auto">
            <Submenu />
            <Searchbar />
          </div>
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
