import { motion } from "framer-motion";
import { Button } from "@heroui/react";
import { CARD_TRANSITION_ID, TRANSITION_CONFIG } from "@/pages/_app";
import { useRouter } from "next/router";
import DefaultLayout from "@/layouts/default";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

const DetailPage = ({ item }) => {
  const router = useRouter();

  const [issuer, setIssuer] = useState("");
  const [id, setId] = useState("");
  const [reward, setReward] = useState("");

  useEffect(() => {
    const x = async () => {
      const r = await supabase.from("a-objs").select().eq("id", 4);
      setId(r.data[0].id);
      setIssuer(r.data[0].issuer);
      setReward(r.data[0].reward);
    };
    x();
  }, []);

  return (
    <DefaultLayout>
      <motion.div
        layoutId={`${CARD_TRANSITION_ID}-${4}`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={TRANSITION_CONFIG}
        className="flex items-center justify-center min-h-screen p-6"
      >
        <motion.div
          className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl p-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={TRANSITION_CONFIG}
        >
          {/* Detailed view content */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Item Details</h2>
            <Button
              onClick={() => router.push("/")}
              variant="flat"
              color="primary"
            >
              Back to List
            </Button>
          </div>

          {/* Add your detailed item content here */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Information</h3>
              {/* Display item details */}
              <p>ID: {id}</p>
              <p>Issuer: {issuer}</p>
              <p>Reward: {reward}</p>
            </div>

            <div>{/* Additional details or images */}</div>
          </div>
        </motion.div>
      </motion.div>
    </DefaultLayout>
  );
};

export default DetailPage;
