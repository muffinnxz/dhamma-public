import { IoIosArrowDown } from "react-icons/io";
import { IoIosArrowUp } from "react-icons/io";

import { Checkbox } from "@/components/ui/checkbox"
import { Category } from "@/interfaces/stock";
import { useState } from "react";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion"

export default function CategoryMenu({ category, setCategory }: { category: Category[], setCategory: Function }) {
    const [showCategory, setShowCategory] = useState(true);

    const categoryHandler = (cat: Category) => {
        if (category.includes(cat)) {
            setCategory(category.filter((c) => c !== cat));
        } else {
            setCategory([...category, cat]);
        }
    }

    return (
        <Accordion type="single" collapsible className="w-full">
            <div></div>
            <AccordionItem value="item-2">
                <AccordionTrigger>Category</AccordionTrigger>
                <AccordionContent className="space-y-3">
                    {showCategory && Object.values(Category).map((category) => (
                        <div key={category} className="flex items-center">
                            <Checkbox id={category} onClick={() => categoryHandler(category)}/>
                            <label htmlFor={category} className="cursor-pointer pl-[30px] text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {category}
                            </label>
                        </div>
                    ))}
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    )

}