<template>
  <FormGroup v-if="info" :id="id" :label-type="data.noLabel ? LabelType.None : info.label" v-bind="mappedProps">
    <div :style="{ width: 'max-content', border: border }">
      <component :is="info.class" :data="data" :current-id="id" ref="desc" />
    </div>
  </FormGroup>
</template>

<script setup lang="ts">
import { computed } from "vue";
import FormGroup from "@/components/FormGroup.vue";
import { pick } from "lodash";
import { LabelType, validationFuncs, validationFuncsRange } from "@/common/shared";
import { useWidgetsStore } from "@/common/stores";
import { Widget } from "@/config";
import WidgetDropdown from "@/components/WidgetDropdown.vue";
import WidgetHeading from "@/components/WidgetHeading.vue";
import WidgetInput from "@/components/WidgetInput.vue";
import WidgetLabel from "@/components/WidgetLabel.vue";
import WidgetMultiCheckbox from "@/components/WidgetMultiCheckbox.vue";
import WidgetPicture from "@/components/WidgetPicture.vue";
import WidgetPositions from "@/components/WidgetPositions.vue";
import WidgetRadio from "@/components/WidgetRadio.vue";
import WidgetSpacer from "@/components/WidgetSpacer.vue";
import WidgetSpinbox from "@/components/WidgetSpinbox.vue";
import WidgetStopwatch from "@/components/WidgetStopwatch.vue";
import WidgetTextarea from "@/components/WidgetTextarea.vue";
import WidgetToggleGrid from "@/components/WidgetToggleGrid.vue";

const props = defineProps<{
  id: string,
  data: Widget
}>();

defineExpose({ id: props.id, type: props.data.type, validate });

interface WidgetDesc {
  index?: number
}

const widgets = useWidgetsStore();
const desc = $ref<WidgetDesc>();

let border = $ref("none");

// Table containing metadata for each widget type
const info = {
  dropdown:      { class: WidgetDropdown,      label: LabelType.LabelTag  },
  heading:       { class: WidgetHeading,       label: LabelType.None,     },
  label:         { class: WidgetLabel,         label: LabelType.None,     },
  text:          { class: WidgetInput,         label: LabelType.LabelTag  },
  number:        { class: WidgetInput,         label: LabelType.LabelTag  },
  checkbox:      { class: WidgetInput,         label: LabelType.LabelTag  },
  multicheckbox: { class: WidgetMultiCheckbox, label: LabelType.PlainText },
  picture:       { class: WidgetPicture,       label: LabelType.None      },
  positions:     { class: WidgetPositions,     label: LabelType.PlainText },
  radio:         { class: WidgetRadio,         label: LabelType.PlainText },
  spacer:        { class: WidgetSpacer,        label: LabelType.None      },
  spinbox:       { class: WidgetSpinbox,       label: LabelType.LabelTag  },
  stopwatch:     { class: WidgetStopwatch,     label: LabelType.PlainText },
  textarea:      { class: WidgetTextarea,      label: LabelType.LabelTag  },
  togglegrid:    { class: WidgetToggleGrid,    label: LabelType.PlainText }
}[props.data.type];

const teamNumbers = $computed(() => {
  const teamValue = widgets.values.find(w => w.name === "Team")?.value;
  // This turns "2832, 33, 67" into ["2832", "33", "67"]
  return teamValue ? String(teamValue).split(',').map(s => s.trim()) : [];
});

const dynamicName = $computed(() => {
  let name = props.data.name;
  if (!name) return "";

  // Check for our placeholders and replace them with the actual team numbers
  if (name.includes("Bot 1") && teamNumbers[0]) name = name.replace("Bot 1", `${teamNumbers[0]}`);
  if (name.includes("Bot 2") && teamNumbers[1]) name = name.replace("Bot 2", `${teamNumbers[1]}`);
  if (name.includes("Bot 3") && teamNumbers[2]) name = name.replace("Bot 3", `${teamNumbers[2]}`);

  return name;
});

// Props to pass from the widget data to the sub-components
const mappedProps = $computed(() => ({
  ...pick(props.data, ["name", "align", "row", "col", "rowspan", "colspan", "labelColspan"]),
  name: dynamicName
}));

// Validates the value of the widget.
function validate() {
  // Some widgets don't export values (and thus don't have entries in the array)
  if (desc?.index === undefined) return true;

  // Only some widget types can be validated
  const canValidate = ["dropdown", "text", "number", "multicheckbox", "positions", "stopwatch", "textarea"];
  if (!canValidate.includes(props.data.type)) return true;

  // Skip validation if not specified
  const { validation } = props.data;
  if (validation === undefined) return true;

  // Get associated widget value from array
  const widgetVal = widgets.values[desc.index].value;

  // Map widget value to a number to validate
  let valueToValidate = 0;
  if ((typeof widgetVal === "string") || Array.isArray(widgetVal)) valueToValidate = widgetVal.length;
  else if (typeof widgetVal === "number") valueToValidate = widgetVal;
  else return false; // Value can't be validated (internal app error)

  const { comparison, value } = validation;

  // Validate the widget value
  // Some code is duplicated in the conditional branches to avoid false linter errors.
  let validationResult = true;
  if (validationFuncs.has(comparison) && typeof value === "number") {
    const f = validationFuncs.get(comparison);
    if (f === undefined) return true;

    validationResult = f(valueToValidate, value);
  } else if (validationFuncsRange.has(comparison) && Array.isArray(value)) {
    const f = validationFuncsRange.get(comparison);
    if (f === undefined) return true;

    validationResult = f(valueToValidate, value);
  } else {
    // Invalid validation criteria
    return true;
  }

  // Set border and return result
  border = validationResult ? "none" : "2px solid red";
  return validationResult;
}
</script>
