import { Document, Schema, model } from "mongoose";
import { ExampleInterface } from "@interfaces/example.interface";

export const exampleModelSchema: Schema = new Schema({
  test: {
    type: String,
    required: true,
  },
});

export const ExampleModel = model<ExampleInterface & Document>(
  "test",
  exampleModelSchema
);
