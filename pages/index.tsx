import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Image,
} from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import DefaultLayout from "@/layouts/default";

const initialArr = [1, 2, 3, 4, 5, 6];

import { useCheckbox, Chip, VisuallyHidden, tv } from "@heroui/react";
import { useAtom } from "jotai";
import { assessmentResultsAtom } from "@/lib/jotai";

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
      base: "border-default hover:bg-default-200",
      content: "text-default-500",
    },
    variants: {
      isSelected: {
        true: {
          base: "border-primary bg-primary-400 hover:bg-primary-500 hover:border-primary-500",
          content: "text-primary-foreground pl-1",
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
        className="bg-gradient-to-tr from-blue-500 to-purple-500 text-white shadow-lg"
        radius="full"
        classNames={{
          base: styles.base(),
          content: styles.content(),
        }}
        // color="primary"
        startContent={
          isSelected ? (
            <CheckIcon className="ml-1 mr-2" />
          ) : (
            <UncheckIcon className="ml-1 mr-2" />
          )
        }
        variant="flat"
        {...getLabelProps()}
      >
        {children ? children : isSelected ? "Personal Sorting" : "Personal Sorting"}
      </Chip>
    </label>
  );
};

const IndexPage = () => {
  const [items, setItems] = useState(initialArr);
  const [results] = useAtom(assessmentResultsAtom);

  // Toggle item selection on click
  const toggleItem = (item) => {
    setItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
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

  return (
    <DefaultLayout>
      {/* Controls container */}
      <div className="p-6 flex gap-4 justify-end items-center">
        {results.length > 0 ? (
          <CheckboxPersonal />
        ) : (
          <span className="text-gray-400">Checkbox Disabled</span>
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
              key={item}
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
              <Card className="py-6 px-4 cursor-pointer shadow-lg rounded-2xl transition-all hover:shadow-2xl hover:scale-105">
                <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
                  <p className="text-tiny uppercase font-bold text-gray-700">
                    Daily Mix
                  </p>
                  <small className="text-gray-500">12 Tracks</small>
                  <h4 className="font-bold text-lg text-gray-800">
                    Frontend Radio
                  </h4>
                </CardHeader>
                <CardBody className="overflow-visible py-4 flex justify-center">
                  <Image
                    alt="Card background"
                    className="object-cover rounded-xl shadow-md"
                    src="https://heroui.com/images/hero-card-complete.jpeg"
                    width={270}
                  />
                </CardBody>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
    </DefaultLayout>
  );
};
export default IndexPage;
