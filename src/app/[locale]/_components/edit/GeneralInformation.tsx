import { mdiClose } from "@mdi/js";
import Icon from "@mdi/react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo } from "react";
import { useFilePicker } from "use-file-picker";
import { Diet } from "~/models/Diet";
import { type BaseRecipe } from "~/models/Recipe";
import Button from "../inputs/Button";
import GroupedInput from "../inputs/GroupedInput";
import Input from "../inputs/Input";
import InputLabel from "../inputs/InputLabel";
import InputRow from "../inputs/InputRow";
import Select from "../inputs/Select";
import TagSelect from "../recipe/TagSelect";

import styles from "./GeneralInformation.module.css";

type Props = {
  recipe: BaseRecipe;
  setRecipe(recipe: BaseRecipe): void;
  setRecipeImageFile(file?: File): void;
  availableTags: string[];
};

export default function GeneralInformation({
  recipe,
  setRecipe,
  setRecipeImageFile,
  availableTags,
}: Props) {
  const t = useTranslations("common");
  const tr = useTranslations("recipe");

  const dietOptions = useMemo(() => {
    return Diet.options.map((option) => (
      <option value={option} key={option}>
        {t(`diet.selection.${option}`)}
      </option>
    ));
  }, [t]);

  const {
    openFilePicker,
    plainFiles,
    clear: clearFile,
  } = useFilePicker({
    accept: ".jpg",
    readFilesContent: false,
    multiple: false,
  });

  const selectedFile = plainFiles.length > 0 ? plainFiles[0] : undefined;

  useEffect(() => {
    setRecipeImageFile(selectedFile);
  }, [setRecipeImageFile, selectedFile]);

  return (
    <>
      <InputRow>
        <InputLabel width="30%">{tr("edit.name")}</InputLabel>
        <Input
          name="recipeName"
          value={recipe.name}
          onChange={(event) =>
            setRecipe({ ...recipe, name: event.currentTarget.value })
          }
          grow={1}
        />
      </InputRow>
      <InputRow>
        <InputLabel width="30%">{tr("edit.diet")}</InputLabel>
        <Select
          id="recipeDiet"
          value={recipe.diet}
          onChange={(event) =>
            setRecipe({ ...recipe, diet: event.currentTarget.value as Diet })
          }
          grow={1}
        >
          {dietOptions}
        </Select>
      </InputRow>
      <InputRow>
        <InputLabel width="30%">{tr("edit.servings")}</InputLabel>
        <Input
          name="recipeServingsCount"
          value={recipe.servings.count}
          onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
          onChange={(event) => {
            const newServings = { ...recipe.servings };
            if (event.currentTarget.value.length > 0) {
              newServings.count = parseInt(event.currentTarget.value);
            } else {
              newServings.count = 0;
            }
            setRecipe({ ...recipe, servings: newServings });
          }}
          width="30%"
        />
        <Input
          name="recipeServingsLabel"
          value={recipe.servings.label ? recipe.servings.label : ""}
          placeholder={tr("servings")}
          onChange={(event) => {
            const newServings = { ...recipe.servings };
            if (event.currentTarget.value.length > 0) {
              newServings.label = event.currentTarget.value;
            } else {
              delete newServings.label;
            }
            setRecipe({ ...recipe, servings: newServings });
          }}
          grow={1}
        />
      </InputRow>
      <InputRow>
        <InputLabel width="30%">{tr("edit.cookTime")}</InputLabel>
        <Input
          name="recipeCookTime"
          value={recipe.cookTime}
          onKeyPress={(e) => !/[0-9]/.test(e.key) && e.preventDefault()}
          onChange={(event) => {
            if (event.currentTarget.value.length > 0) {
              setRecipe({
                ...recipe,
                cookTime: parseInt(event.currentTarget.value),
              });
            } else {
              setRecipe({ ...recipe, cookTime: 0 });
            }
          }}
          grow={1}
        />
      </InputRow>
      <InputRow>
        <InputLabel width="30%">{tr("edit.source")}</InputLabel>
        <Input
          name="recipeSource"
          value={recipe.source}
          placeholder={tr("source")}
          onChange={(event) =>
            setRecipe({ ...recipe, source: event.currentTarget.value })
          }
          grow={1}
        />
      </InputRow>
      <InputRow>
        <InputLabel width="30%">{tr("edit.image")}</InputLabel>
        <GroupedInput>
          <span
            onClick={() => openFilePicker()}
            className={styles.fileSelector}
          >
            {selectedFile?.name ?? tr("edit.fileSelect")}
          </span>
          <Button variant="remove" onClick={() => clearFile()}>
            <Icon path={mdiClose} size={0.8} />
          </Button>
        </GroupedInput>
      </InputRow>
      <InputRow>
        <InputLabel width="30%">{tr("edit.tags")}</InputLabel>
        <TagSelect
          values={recipe.tags}
          options={availableTags}
          onChange={(values) =>
            setRecipe({ ...recipe, tags: values.map((value) => value.value) })
          }
          creatable
          instanceId={"edit-general-information-tag-select"}
          className={styles.tagSelect}
        />
      </InputRow>
    </>
  );
}
