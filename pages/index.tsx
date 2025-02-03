import {
  Button,
  Card,
  CardBody, CardFooter,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
  Link,
} from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import {useEffect, useState} from "react";

import DefaultLayout from "@/layouts/default";

const initialArr = [1, 2, 3, 4, 5, 6];

import { useCheckbox, Chip, VisuallyHidden, tv } from "@heroui/react";
import { useAtom } from "jotai";
import { assessmentResultsAtom } from "@/lib/jotai";
import NextLink from "next/link";
import {supabase} from "@/lib/supabaseClient";

const CheckIcon = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      aria-hidden="true"
      focusable="false"
      height="1em"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      className="!text-white"
      width="1em"
      {...props}
    >
      <path
        aria-hidden="true"
        className="!text-white"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
    </svg>
  );
};

const UncheckIcon = (props) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="size-6"
      aria-hidden="true"
      fill="none"
      focusable="false"
      height="1em"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      width="1em"
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z"
      />
    </svg>
  );
};

const CheckboxPersonal = () => {
  const {
    children,
    isSelected,
    isFocusVisible,
    getBaseProps,
    getLabelProps,
    getInputProps,
  } = useCheckbox({
    defaultSelected: true,
  });

  const checkbox = tv({
    slots: {
      base: "border-default shadow-md hover:bg-default-200",
      content: "text-default-500",
    },
    variants: {
      isSelected: {
        true: {
          base: "border-primary !text-white bg-indigo-400 hover:bg-indigo-500 hover:border-indigo-500",
          content: "text-indigo-foreground pl-1",
        },
      },
      isFocusVisible: {
        true: {
          base: "outline-none ring-2 ring-focus ring-offset-2 ring-offset-background",
        },
      },
    },
  });

  const styles = checkbox({ isSelected, isFocusVisible });

  return (
    <label {...getBaseProps()}>
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <Chip
        size={"lg"}
        className="bg-gradient-to-tr from-blue-500 to-purple-500 text-white"
        radius="full"
        classNames={{
          base: styles.base(),
          content: styles.content(),
        }}
        // color="indigo"
        startContent={
          isSelected ? (
            <CheckIcon className="mr-2 ml-1" />
          ) : (
            <UncheckIcon className="mr-2 ml-1" />
          )
        }
        variant="flat"
        {...getLabelProps()}
      >
        {children
          ? children
          : isSelected
            ? "Personal Sorting"
            : "Personal Sorting"}
      </Chip>
    </label>
  );
};

const IndexPage = () => {
  const [items, setItems] = useState([]);
  const [results] = useAtom(assessmentResultsAtom);


  useEffect(() => {
    const x = async () => {
      const r = await supabase.from("a-objs").select();
      setItems(r.data)
    };
    x()
    
  }, []);
  
  // Toggle item selection on click
  const toggleItem = (item) => {
    setItems((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item]
    );
  };

  // Handle sort selection from the dropdown
  const handleSort = (key) => {
    let sortedItems;
    if (key === "asc") {
      sortedItems = [...items].sort((a, b) => a - b);
    } else if (key === "desc") {
      sortedItems = [...items].sort((a, b) => b - a);
    } else {
      // "default" resets to the initial ordering
      sortedItems = [...initialArr];
    }
    setItems(sortedItems);
  };

  // @ts-ignore
  return (
    <DefaultLayout>
      {/* Controls container */}
      <div className="flex items-center justify-end gap-4 p-6">
        {results.length > 0 ? (
          <CheckboxPersonal />
        ) : (
          <span className="text-gray-400">
            Personal Sorting is Disabled - Please Complete{" "}
            <NextLink as={"span"} href="/assessment">
              <Link as="span">The Assessment</Link>
            </NextLink>
          </span>
        )}
        <Dropdown>
          <DropdownTrigger>
            <Button
              size={"lg"}
              className="bg-gradient-to-tr from-blue-500 to-purple-500 text-white shadow-lg"
              radius="full"
            >
              Sort By
            </Button>
          </DropdownTrigger>
          <DropdownMenu
            aria-label="Sort Options"
            onAction={(key) => handleSort(key)}
          >
            <DropdownItem key="default">Default</DropdownItem>
            <DropdownItem key="asc">Ascending</DropdownItem>
            <DropdownItem key="desc">Descending</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </div>

      {/* Grid displaying the cards */}
      <motion.div
        layout
        className="grid grid-cols-3 gap-6 p-6"
        transition={{
          duration: 0.5,
          type: "spring",
          stiffness: 100,
          damping: 15,
        }}
      >
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              layout
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              transition={{
                duration: 0.5,
                type: "spring",
                stiffness: 120,
                damping: 20,
              }}
              onClick={() => toggleItem(item)}
            >
              <Card className="cursor-pointer rounded-2xl px-4 py-6 shadow-lg transition-all hover:scale-105 hover:shadow-2xl">
                <CardHeader className="flex-col items-start px-4 pt-2 pb-0">
                  <div className={`flex w-full justify-between items-around`}>
                    <p className="font-bold uppercase text-gray-700 text-tiny">
                      Daily Mix
                    </p>
                    <Chip className="scale-85" variant="flat" size="sm">#{item.id}</Chip>
                  </div>
                  <small className="text-gray-500">12 Tracks</small>
                  <h4 className="text-lg font-bold text-gray-800">
                    Frontend Radio
                  </h4>
                </CardHeader>
                <CardBody className="flex justify-center overflow-visible py-4">
                  <Image
                    alt="Card background"
                    className="rounded-xl object-cover shadow-md"
                    src="https://heroui.com/images/hero-card-complete.jpeg"
                    width={270}
                  />
                </CardBody>
                <CardFooter className="flex-col items-end px-4 pt-2 pb-0">
                  <Button radius="full" color="primary" variant="flat">
                    Apply To Join
                  </Button>
                  {/*<small className="text-gray-500">12 Tracks</small>*/}
                  {/*<h4 className="text-lg font-bold text-gray-800">*/}
                  {/*  Frontend Radio*/}
                  {/*</h4>*/}
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </DefaultLayout>
  );
};
export default IndexPage;
