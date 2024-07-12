import { mdiClockOutline } from "@mdi/js";
import Icon from "@mdi/react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import styled from "styled-components";
import { Recipe, RecipeInIndex } from "../models/Recipe";
import DishImage from "./DishImage";
import IconForDiet from "./IconForDiet";
import TagSelect from "./TagSelect";

type Props = {
  id: Recipe["id"];
  name: Recipe["name"];
  cookTime: Recipe["cookTime"];
  diet: Recipe["diet"];
  s3Url?: RecipeInIndex["s3Url"];
  tags: Recipe["tags"];
};

const HEIGHT = 8; //rem

const Dish = styled.a`
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  color: var(--color-text-primary);

  img {
    transition: transform 0.15s linear;
  }

  :hover img {
    transform: scale(1.1);
  }
`;

const ImageContainer = styled.div`
  width: ${HEIGHT * 1.539}rem;
  height: ${HEIGHT}rem;
  position: relative;
  overflow: hidden;
  border-radius: var(--rounded);
  background: var(--color-background-alt);
`;

const DishStats = styled.div`
  width: 100%;
  bottom: 0;
  z-index: 2;
  padding: 1rem 2rem;
`;

const DishName = styled.h4`
  margin: 0 0 1rem 0;
  font-weight: 400;
  font-size: 1.25rem;
`;

const DishStatLine = styled.span`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`;

const IconStat = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const DishListItem = ({ id, name, cookTime, diet, s3Url, tags }: Props) => {
  const { t } = useTranslation("common");
  return (
    <Link href={`/r/${id}`} passHref prefetch={false}>
      <Dish>
        <ImageContainer>
          <DishImage
            s3Url={s3Url}
            layout="fill"
            objectFit="cover"
            quality={60}
            sizes="(max-width: 600px) 100px, (min-width: 601px) 160px"
            alt=""
          />
        </ImageContainer>
        <DishStats>
          <DishName>{name}</DishName>
          <DishStatLine>
            <IconStat>
              <Icon
                id={`preparationTime_${id}`}
                path={mdiClockOutline}
                size={0.75}
                title={t("preparationTime.label")}
              />
              <span>
                {t("preparationTime.inMinutes", { minutes: cookTime })}
              </span>
            </IconStat>
            <IconForDiet id={`diet_${id}`} diet={diet} size={0.75} />
            <TagSelect values={tags} onlyShow instanceId={id} />
          </DishStatLine>
        </DishStats>
      </Dish>
    </Link>
  );
};

export default DishListItem;
