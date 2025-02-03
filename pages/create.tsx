import { Form, Input, Button, User } from "@heroui/react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { DatePicker } from "@heroui/react";
import { now, getLocalTimeZone } from "@internationalized/date";
import { useAccount } from "wagmi";
import OpenAI from "openai";
import { supabase } from "@/lib/supabaseClient";

const DeadlineComponent = () => (
  <div className="w-full max-w-xl flex flex-row gap-4">
    <DatePicker
      hideTimeZone
      size="lg"
      showMonthAndYearPickers
      defaultValue={now(getLocalTimeZone()) as any}
      label="Deadline"
      variant="bordered"
    />
  </div>
);

const FormComponent = () => {
  const [errors, setErrors] = useState({});
  const [metrics, setMetrics] = useState([""]);

  const onSubmit = (e) => {
    e.preventDefault();

    const data: any = Object.fromEntries(new FormData(e.currentTarget));
    data.successMetrics = metrics.filter((metric) => metric.trim() !== "");

    if (!data.name) {
      setErrors({ name: "Name is required" });
      return;
    }

    const result = callServer(data);

    setErrors(result.errors);
  };

  const addMetric = () => {
    setMetrics([...metrics, ""]);
  };

  const removeMetric = (index) => {
    if (metrics.length > 1) {
      setMetrics(metrics.filter((_, i) => i !== index));
    }
  };

  const [status, setStatus] = useState(null);

  const { address } = useAccount();
  const handleCreateObjective = async () => {
    const r = await supabase.from("a-objs").insert({
      name: "test",
      success_metrics: ["test"],
      issuer: address,
    });
    r.status === 201 ? setStatus("success") : setStatus("error");
  };

  const updateMetric = (index, value) => {
    const newMetrics = [...metrics];
    newMetrics[index] = value;
    setMetrics(newMetrics);
  };

  return (
    <Form
      className="w-full max-w-xs flex flex-col gap-8"
      validationErrors={errors}
      onSubmit={onSubmit}
    >
      <Input
        size="lg"
        variant="underlined"
        label="Name"
        labelPlacement="outside"
        name="name"
        placeholder="Enter Objective's name"
      />
      <div className="flex flex-col w-full gap-4">
        <p className="text-lg font-semibold">Success Metrics</p>
        <AnimatePresence>
          {metrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="flex items-center gap-2"
            >
              <Input
                size="lg"
                variant="underlined"
                placeholder={`Enter Success Metric ${index + 1}`}
                value={metric}
                onChange={(e) => updateMetric(index, e.target.value)}
              />
              {metrics.length > 1 && (
                <Button
                  size="sm"
                  className="!w-[20px]"
                  radius="full"
                  type="button"
                  variant="bordered"
                  onPress={() => removeMetric(index)}
                >
                  -
                </Button>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <Button
          type="button"
          className="mt-4"
          radius="full"
          variant="ghost"
          color="primary"
          onPress={addMetric}
        >
          +
        </Button>
      </div>
      <DeadlineComponent />
      <Input
        type="number"
        label="Reward"
        size="lg"
        variant="underlined"
        placeholder="0.00"
        startContent={
          <div className="pointer-events-none flex items-center">
            <span className="text-default-400 text-small">$</span>
          </div>
        }
        endContent={
          <div className="pointer-events-none flex items-center">
            <span className="text-default-400 text-small">USDC</span>
          </div>
        }
      />
      <Button fullWidth size="lg" type="submit" variant="flat">
        Check
      </Button>

      <Button
        onPress={handleCreateObjective}
        color="primary"
        fullWidth
        size="lg"
        type="submit"
        variant="flat"
      >
        Create
      </Button>
      <pre>{JSON.stringify(status, null, 2)}</pre>
    </Form>
  );
};

// Fake server used in this example.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function callServer(data) {
  return {
    errors: {
      name: "Sorry, this name is taken.",
    },
  };
}

const CreatePage = () => {
  const client = new OpenAI({
    apiKey: process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY,
    baseURL: "https://api.deepseek.com",
    dangerouslyAllowBrowser: true,
  });

  const { address } = useAccount();
  return (
    <div className="flex sm:max-w-xl mx-auto flex-col gap-8 justify-center items-center">
      <User
        className="self-end"
        avatarProps={{
          src: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGklunSbvzFMwXyBTzb9Nq0AGvaV4FV6SX7Laz-0rB7ECl2PB3YbrGnqZ5t5X0hiFj9kA&usqp=CAU",
        }}
        description={"..." + address?.slice(-5)}
        name="Objective Issuer"
      />
      <FormComponent/>
    </div>
  );
};

export default CreatePage;
