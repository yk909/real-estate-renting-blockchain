"use client";
import React from "react";
import { AiOutlineMenu } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { signOut, signIn } from "next-auth/react";
import { createUser } from "@/services/user";
import { User } from "next-auth";
import { ethers } from "ethers";
import { db } from "@/lib/db";

import Avatar from "../Avatar";
import MenuItem from "./MenuItem";
import Menu from "@/components/Menu";
import RentModal from "../modals/RentModal";
import Modal from "../modals/Modal";
import AuthModal from "../modals/AuthModal";
import { menuItems } from "@/utils/constants";
import { BsHouseHeartFill } from "react-icons/bs";

import { connectWallet, disconnectWallet } from "@/Blockchain.services";

interface UserMenuProps {
  // user?: User & {
  //   id: string;
  // };
  user?: any;
}

declare global {
  interface Window {
    ethereum?: any;
  }
}

const UserMenu: React.FC<UserMenuProps> = ({ user }) => {
  const router = useRouter();

  const redirect = (url: string) => {
    router.push(url);
  };

  return (
    <div className="relative">
      <div className="flex flex-row items-center gap-3">
        <Modal>
          {/* <button
              type="button"
              className="hidden md:block text-sm font-bold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer text-[#585858]"
              onClick={() => {router.push('/listings')}}
            >
              List homes
            </button> */}
          <div
            onClick={() => {
              router.push("/listings");
            }}
            className="ml-[20px]"
          >
            <BsHouseHeartFill className="w-[20px] h-[20px] hover:cursor-pointer" />
          </div>

          <Menu>
            <Menu.Toggle id="user-menu">
              <button
                type="button"
                className=" p-4 md:py-1 md:px-2 border-[1px]   border-neutral-200  flex  flex-row  items-center   gap-3   rounded-full   cursor-pointer   hover:shadow-md   transition duration-300"
              >
                <AiOutlineMenu className="w-[15px] h-[15px]" />
                <div className="hidden md:block">
                  <Avatar src={user?.image} />
                </div>
              </button>
            </Menu.Toggle>
            <Menu.List className="shadow-[0_0_36px_4px_rgba(0,0,0,0.075)] rounded-xl bg-white text-sm">
              {user ? (
                <>
                  {menuItems.map((item) => (
                    <MenuItem
                      label={item.label}
                      onClick={() => redirect(item.path)}
                      key={item.label}
                    />
                  ))}

                  <Modal.Trigger name="share">
                    <MenuItem label="Share your home" />
                  </Modal.Trigger>
                  {/* <hr /> */}
                  {/* <MenuItem label="Log out" onClick={signOut} /> */}
                  {/* <MenuItem
                    label="Disconnect Wallet"
                    onClick={disconnectWallet}
                  /> */}
                </>
              ) : (
                <>
                  {/* <MenuItem label="Log in" onClick={onSignInWithCrypto} /> */}
                  <MenuItem label="Connect Wallet" onClick={connectWallet} />
                </>
              )}
            </Menu.List>
          </Menu>

          <Modal.Window name="share">
            <RentModal />
          </Modal.Window>
        </Modal>
      </div>
    </div>
  );
};

export default UserMenu;
