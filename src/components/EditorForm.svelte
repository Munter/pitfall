<script lang="ts">
  import z from "zod";
  import type { EditorFormProps } from "../types/form";
  import { TILE_SIZE } from "../constants";

  const formSchema = z.object({
    isEditing: z.coerce.boolean().optional().default(false),
    showCities: z.coerce.boolean().optional().default(false),
    zoom: z.coerce
      .number()
      .min(1)
      .max(200)
      .step(1)
      .optional()
      .default(TILE_SIZE),
  });

  export let values: EditorFormProps = {
    isEditing: false,
    showCities: true,
    zoom: TILE_SIZE,
  };

  export let onChange: (value: EditorFormProps) => void;

  function handleChange(e: Event) {
    const form = e.currentTarget as HTMLFormElement;
    const formValues = new FormData(form);
    const values = Object.fromEntries(formValues.entries());
    const result = formSchema.safeParse(values);

    if (result.success) {
      onChange(result.data);
    } else {
      console.error(
        "Validation errors:",
        JSON.stringify(result.error.errors, null, 2)
      );
    }
  }
</script>

<form on:input={handleChange}>
  <label class="checkbox">
    <input type="checkbox" name="isEditing" bind:checked={values.isEditing} />
    EditMode
  </label>

  <label class="checkbox">
    <input type="checkbox" name="showCities" bind:checked={values.showCities} />
    Show Cities
  </label>

  <label>
    <input type="range" name="zoom" min="1" max="200" value={values.zoom} />
    Zoom: {values.zoom || 50}
  </label>
</form>

<style>
  .checkbox {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem;
  }
</style>
