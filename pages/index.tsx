import { Card, CardBody, CardHeader, Image } from "@heroui/react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import DefaultLayout from "@/layouts/default";

const initialArr = [1, 2, 3, 4, 5, 6];

export default function IndexPage() {
  const [items, setItems] = useState(initialArr);

  const toggleItem = (item) => {
    setItems((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item],
    );
  };

  return (
    <DefaultLayout>
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
}
