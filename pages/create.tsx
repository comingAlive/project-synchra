import DefaultLayout from "@/layouts/default";

import { Form, Input, Button } from "@heroui/react";
import { useState } from "react";

const FormComponent = () => {
  const [errors, setErrors] = useState({});
  const [metrics, setMetrics] = useState(["", "", ""]);

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
      <p className="text-sm text-gray-600">
        OI defines a task (e.g., "Build cross-chain API") with embedded success
        metrics, deadlines, and crypto rewards.
      </p>
      <Input
        size="lg"
        variant="underlined"
        label="Name"
        labelPlacement="outside"
        name="name"
        placeholder="Enter Objective's name"
      />
      <div className="flex flex-col gap-2">
        <p className="text-sm font-semibold">Success Metrics:</p>
        {metrics.map((metric, index) => (
          <Input
            key={index}
            size="lg"
            variant="underlined"
            placeholder={`Enter Success Metric ${index + 1}`}
            value={metric}
            onChange={(e) => updateMetric(index, e.target.value)}
          />
        ))}
        <Button type="button" variant="flat" onClick={addMetric}>
          + Add Metric
        </Button>
      </div>
      <Button type="submit" variant="flat">
        Submit
      </Button>
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
  return (
    <DefaultLayout>
      <div className="flex justify-center items-center">
        <FormComponent />
      </div>
    </DefaultLayout>
  );
};

export default CreatePage;
