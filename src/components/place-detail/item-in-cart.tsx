
import { FaRegTrashAlt } from "react-icons/fa";
import { Button } from "../ui/button";
import { useState } from "react";
import useUser from "@/hooks/use-user";
import { useEffect } from "react";
import { Cart } from "@/interfaces/cart";
import { Stock } from "@/interfaces/stock";
import Image from "next/image";

export default function ItemInCart({ id,item,requestAmount,donateAmount }: { id:string,item: Stock,requestAmount:number,donateAmount:number }) {
    const {carts, setCarts} = useUser();

    const increaseAmount = () => {
        let placeCart = carts?.find(cart => cart.placeId === id) as Cart;
        let foundItem = placeCart?.donateItems.find(itemCart => itemCart.stock?.id === item.id);
        if (foundItem) {
            foundItem.donationAmount = Math.min(donateAmount + 1,requestAmount);
        }
        let newCarts = carts?.map(cart => {
            if (cart.placeId === id) {
                return placeCart;
            }
            return cart;
        }
        ) ?? [];
        setCarts(newCarts);
    }

    const decreaseAmount = () => {
        let placeCart = carts?.find(cart => cart.placeId === id) as Cart;
        let foundItem = placeCart?.donateItems.find(itemCart => itemCart.stock?.id === item.id);
        if (foundItem) {
            foundItem.donationAmount = donateAmount - 1;
            if (foundItem.donationAmount <= 0) {
                deleteItem();
            }else{
                let newCarts = carts?.map(cart => {
                    if (cart.placeId === id) {
                        return placeCart;
                    }
                    return cart;
                }) ?? [];
                setCarts(newCarts);
            }
        }
    }

    const deleteItem = () => {
        let placeCart = carts?.find(cart => cart.placeId === id) as Cart;
        placeCart.donateItems = placeCart.donateItems.filter(itemCart => itemCart.stock?.id !== item.id);
        let newCarts = carts?.map(cart => {
            if (cart.placeId === id) {
                return placeCart;
            }
            return cart;
        }) ?? [];
        setCarts(newCarts);
    }


    return (
    <div className="flex py-3">
        <div className="w-[120px] h-[120px]">
            <Image width={500} height={500} src={item.thumbnail} alt="item" className="w-[120px] h-[120px] object-cover rounded"/>
        </div>
        <div className="flex-1 px-3 py-1 flex flex-col justify-between">
            <div className="flex flex-col justify-between">
                <div className="flex justify-between">
                    <p>{item.name}</p>
                    <p>{(item.price ?? 0) * (carts?.find(cart => cart.placeId === id)?.donateItems.find(itemCart => itemCart.stock?.id === item.id)?.donationAmount ?? 0) } THB</p>
                </div>
                <p>{item.price} THB</p>
                <p className="text-sm text-primary-dark-blue text-opacity-50">{item.description}</p>
            </div>
            <div className="flex gap-5 items-center">
                <div className="flex gap-3">
                    <Button className="bg-primary-dark-blue text-white rounded-full p-0 w-8 h-5" onClick={decreaseAmount}>-</Button>
                    <p>{(carts?.find(cart => cart.placeId === id)?.donateItems.find(itemCart => itemCart.stock?.id === item.id)?.donationAmount ?? 0)}</p>
                    <Button className="bg-primary-dark-blue text-white rounded-full p-0 w-8 h-5" onClick={increaseAmount}>+</Button>
                </div>
                <Button className="p-0 h-fit bg-white text-primary-dark-blue hover:bg-white" onClick={deleteItem}>
                    <FaRegTrashAlt />
                </Button>
                
            </div>
        </div>
    </div>
)
    
    
}