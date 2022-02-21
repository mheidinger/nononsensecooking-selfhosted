import { mdiClose } from "@mdi/js";
import Icon from "@mdi/react";
import { useTranslation } from "next-i18next";
import { useEffect, useMemo } from "react";
import { useFilePicker } from "use-file-picker";
import { Diet, Recipe } from "../../models/Recipe";
import { InputLabel, InputRow, Input, Select, FileSelector, GroupedInput, RemoveButton } from "../Inputs";

type Props = {
  recipe: Recipe;
  setRecipe(recipe: Recipe): void;
  setRecipeImageFile(file?: File): void;
};

const GeneralInformation = ({recipe, setRecipe, setRecipeImageFile}: Props) => {
  const { t: tr } = useTranslation("recipe");

  const dietOptions = useMemo(() => {
    const options: JSX.Element[] = [];
    for (const diet in Diet) {
      options.push(<option value={Diet[diet]} key={Diet[diet]}>{diet}</option>)
    }
    return options;
  }, []);

  const [openFileSelector, {plainFiles, clear: clearFile}] = useFilePicker({
    accept: ".jpg",
    readFilesContent: false,
    multiple: false,
  });

  const selectedFile = plainFiles.length > 0 ? plainFiles[0] : undefined;

  useEffect(() => {
    setRecipeImageFile(selectedFile);
  }, [setRecipeImageFile, selectedFile])

  return (
    <>
      <InputRow>
        <InputLabel width="30%">{tr("edit.name")}</InputLabel>
        <Input
          name="recipeName"
          value={recipe.name}
          onChange={event => setRecipe({...recipe, name: event.target.value})}
          grow={1}
        />
      </InputRow>
      <InputRow>
        <InputLabel width="30%">{tr("edit.diet")}</InputLabel>
        <Select
          id="recipeDiet"
          value={recipe.diet}
          onChange={event => setRecipe({...recipe, diet: event.target.value as Diet})}
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
            const newServings = {...recipe.servings};
            if (event.target.value.length > 0) {
              newServings.count = parseInt(event.target.value);
            } else {
              newServings.count = 0;
            }
            setRecipe({...recipe, servings: newServings});
          }}
          width="30%"
        />
        <Input
          name="recipeServingsLabel"
          value={recipe.servings.label ? recipe.servings.label : ""}
          placeholder={tr("servings")}
          onChange={(event) => {
            const newServings = {...recipe.servings};
            if (event.target.value.length > 0) {
              newServings.label = event.target.value;
            } else {
              delete newServings.label;
            }
            setRecipe({...recipe, servings: newServings});
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
            if (event.target.value.length > 0) {
              setRecipe({...recipe, cookTime: parseInt(event.target.value)});
            } else {
              setRecipe({...recipe, cookTime: 0});
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
          onChange={(event) => setRecipe({...recipe, source: event.target.value})}
          grow={1}
        />
      </InputRow>
      <InputRow>
        <InputLabel width="30%">{tr("edit.image")}</InputLabel>
        <GroupedInput>
          <FileSelector
            onClick={() => openFileSelector()}
          >
            {selectedFile ? selectedFile.name : tr("edit.fileSelect")}
          </FileSelector>
          <RemoveButton onClick={() => clearFile()}>
            <Icon path={mdiClose} size={0.8} />
          </RemoveButton>
        </GroupedInput>

      </InputRow>
    </>
  );
}

export default GeneralInformation;
