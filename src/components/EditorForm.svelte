<script lang="ts">
  import z from "zod";
  import type { EditorFormProps } from "../types/form";

  const formSchema = z.object({
    isEditing: z.coerce.boolean().optional().default(false),
    showCities: z.coerce.boolean().optional().default(false),
  });

  export let values: EditorFormProps = {
    isEditing: false,
    showCities: true,
  };

  export let onChange: (value: EditorFormProps) => void;

  function handleChange(e: Event) {
    const form = e.currentTarget as HTMLFormElement;
    const formValues = new FormData(form);
    const values = Object.fromEntries(formValues.entries());
    const result = formSchema.safeParse(values);

    if (result.success) {
      onChange(result.data);
    }
  }
</script>

<form on:change={handleChange}>
  <label class="checkbox">
    EditMode
    <input type="checkbox" name="isEditing" bind:checked={values.isEditing} />
  </label>

  <label class="checkbox">
    Show Cities
    <input type="checkbox" name="showCities" bind:checked={values.showCities} />
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
