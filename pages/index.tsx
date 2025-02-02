import {
  Badge,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Image,
  Input,
  InputOtp,
  Progress,
  Tooltip,
  tv,
  useCheckbox,
  VisuallyHidden,
} from "@heroui/react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { assessmentResultsAtom } from "@/lib/jotai";
import NextLink from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { CARD_TRANSITION_ID, TRANSITION_CONFIG } from "@/pages/_app";
import CustomListBox from "@/components/CustomListBox";

const initialArr = [1, 2, 3, 4, 5, 6];

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
      setItems(r.data);
    };
    x();
  }, []);

  // Toggle item selection on click
  const toggleItem = (item) => {
    setItems((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item],
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

  const MailIcon = (props) => {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="size-6"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
      </svg>
    );
  };

  // @ts-ignore
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={TRANSITION_CONFIG}
      className="grid grid-cols-3 gap-6 p-6"
    >
      {items.map((item) => (
        <motion.div
          key={item.id}
          layoutId={`${CARD_TRANSITION_ID}-${item.id}`}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={TRANSITION_CONFIG}
        >
          <NextLink href={`/${item.id}`}>
            <Card className="cursor-pointer rounded-2xl px-4 py-6 shadow-lg transition-all hover:scale-105 hover:shadow-2xl">
              <CardHeader className="flex-col items-start px-4 pt-2 pb-0">
                <div className={`flex w-full justify-between items-around`}>
                  <p className="font-bold !w-full uppercase text-gray-700 text-tiny">
                    <Badge content={"~"} variant="flat" color="success">
                      Open ㅤ
                    </Badge>
                  </p>
                  <div className="flex">
                    <Tooltip
                      content={
                        <div className="px-1 py-2">
                          <div className="font-bold text-small">
                            Psy Profile Score
                          </div>
                          <div className="text-tiny">
                            How close the objective essence with your set of
                            skills.
                          </div>
                        </div>
                      }
                    >
                      <Chip
                        color="secondary"
                        className="scale-85"
                        variant="flat"
                        size="sm"
                      >
                        ≃ 0.93
                      </Chip>
                    </Tooltip>

                    <Tooltip
                      content={
                        <div className="px-1 py-2">
                          <div className="font-bold text-small">
                            EVM Address of the OC
                          </div>
                          <div className="text-tiny">Objective Creator</div>
                        </div>
                      }
                    >
                      <Chip
                        color="success"
                        className="scale-85"
                        variant="flat"
                        size="sm"
                      >
                        ..{item.issuer.slice(-4)}
                      </Chip>
                    </Tooltip>

                    <Tooltip
                      content={
                        <div className="px-1 py-2">
                          <div className="font-bold text-small">
                            Objective ID Number
                          </div>
                          <div className="text-tiny">Unique</div>
                        </div>
                      }
                    >
                      <Chip className="scale-85" variant="flat" size="sm">
                        #{item.id}
                      </Chip>
                    </Tooltip>
                  </div>
                </div>
                <small className="text-gray-500">
                  488h to complete (June 15)
                </small>
                <h4 className="text-lg font-bold text-gray-800">
                  Frontend Radio
                </h4>
              </CardHeader>
              <CardBody className="flex justify-center overflow-visible py-4">
                <CustomListBox />
                <Progress
                  className="mt-4"
                  classNames={{
                    base: "max-w-md",
                    track: "drop-shadow-md border border-default",
                    indicator: "bg-gradient-to-r from-primary-500 to-secondary-500",
                    label: "tracking-wider font-medium text-default-600",
                    value: "text-foreground/60",
                  }}
                  label="Progress"
                  radius="sm"
                  showValueLabel={true}
                  size="sm"
                  value={65}
                />

                <div className="my-6 flex flex-col !gap-4">
                  <Input
                    isReadOnly
                    startContent={<MailIcon />}
                    value={"first diaisdsiad dasidsai"}
                    variant="underlined"
                    size="sm"
                  />
                  <Input
                    isReadOnly
                    startContent={<MailIcon />}
                    value={"first diaisdsiad dasidsai"}
                    variant="underlined"
                    size="sm"
                  />
                  <Input
                    isReadOnly
                    startContent={<MailIcon />}
                    value={"first diaisdsiad dasidsai"}
                    variant="underlined"
                    size="sm"
                  />
                </div>
                <Image
                  alt="Card background"
                  className="rounded-xl object-cover shadow-md"
                  src="https://heroui.com/images/hero-card-complete.jpeg"
                  width={270}
                />
              </CardBody>
              <CardFooter className="justify-between px-4 pt-2 pb-0">
                <div className="flex w-full flex-wrap items-center gap-4 md:flex-nowrap">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    data-name="86977684-12db-4850-8f30-233a7c267d11"
                    viewBox="0 0 2000 2000"
                    className="size-8"
                  >
                    <path
                      fill="#2775ca"
                      d="M1000 2000c554.17 0 1000-445.83 1000-1000S1554.17 0 1000 0 0 445.83 0 1000s445.83 1000 1000 1000z"
                    />
                    <path
                      fill="#fff"
                      d="M1275 1158.33c0-145.83-87.5-195.83-262.5-216.66-125-16.67-150-50-150-108.34s41.67-95.83 125-95.83c75 0 116.67 25 137.5 87.5 4.17 12.5 16.67 20.83 29.17 20.83h66.66c16.67 0 29.17-12.5 29.17-29.16v-4.17c-16.67-91.67-91.67-162.5-187.5-170.83v-100c0-16.67-12.5-29.17-33.33-33.34h-62.5c-16.67 0-29.17 12.5-33.34 33.34v95.83c-125 16.67-204.16 100-204.16 204.17 0 137.5 83.33 191.66 258.33 212.5 116.67 20.83 154.17 45.83 154.17 112.5s-58.34 112.5-137.5 112.5c-108.34 0-145.84-45.84-158.34-108.34-4.16-16.66-16.66-25-29.16-25h-70.84c-16.66 0-29.16 12.5-29.16 29.17v4.17c16.66 104.16 83.33 179.16 220.83 200v100c0 16.66 12.5 29.16 33.33 33.33h62.5c16.67 0 29.17-12.5 33.34-33.33v-100c125-20.84 208.33-108.34 208.33-220.84z"
                    />
                    <path
                      fill="#fff"
                      d="M787.5 1595.83c-325-116.66-491.67-479.16-370.83-800 62.5-175 200-308.33 370.83-370.83 16.67-8.33 25-20.83 25-41.67V325c0-16.67-8.33-29.17-25-33.33-4.17 0-12.5 0-16.67 4.16-395.83 125-612.5 545.84-487.5 941.67 75 233.33 254.17 412.5 487.5 487.5 16.67 8.33 33.34 0 37.5-16.67 4.17-4.16 4.17-8.33 4.17-16.66v-58.34c0-12.5-12.5-29.16-25-37.5zm441.67-1300c-16.67-8.33-33.34 0-37.5 16.67-4.17 4.17-4.17 8.33-4.17 16.67v58.33c0 16.67 12.5 33.33 25 41.67 325 116.66 491.67 479.16 370.83 800-62.5 175-200 308.33-370.83 370.83-16.67 8.33-25 20.83-25 41.67V1700c0 16.67 8.33 29.17 25 33.33 4.17 0 12.5 0 16.67-4.16 395.83-125 612.5-545.84 487.5-941.67-75-237.5-258.34-416.67-487.5-491.67z"
                    />
                  </svg>
                  <InputOtp
                    isReadOnly
                    variant="bordered"
                    defaultValue={item.reward}
                    length={String(item.reward).length}
                  />
                </div>
                {/*<Input*/}
                {/*  variant="bordered"*/}
                {/*  className="w-min"*/}
                {/*  radius="full"*/}
                {/*  size="lg"*/}
                {/*  value={"300"}*/}
                {/*/>*/}
                {/*<div className="flex">*/}
                {/*  <Button*/}
                {/*    variant="flat"*/}
                {/*    radius="full"*/}
                {/*    className="text-xl font-medium text-default-500"*/}
                {/*  >USDC</Button>*/}
                {/*</div>*/}
                <Button size="md" radius="full" color="primary" variant="flat">
                  Apply
                </Button>
                {/*<small className="text-gray-500">12 Tracks</small>*/}
                {/*<h4 className="text-lg font-bold text-gray-800">*/}
                {/*  Frontend Radio*/}
                {/*</h4>*/}
              </CardFooter>
            </Card>
          </NextLink>
        </motion.div>
      ))}
    </motion.div>
  );
};
export default IndexPage;
