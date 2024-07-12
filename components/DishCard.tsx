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

const StyledCard = styled.a`
  background: var(--color-background-alt);
  border-radius: var(--rounded-lg);
  cursor: pointer;
  overflow: hidden;
  position: relative;
  display: block;

  img {
    transition: transform 0.15s linear;
  }

  :hover img {
    transform: scale(1.1);
  }
`;

const ImageContainer = styled.div`
  width: 100%;
  height: 0;
  padding-top: 65%;
  position: relative;
`;

const DishStats = styled.div`
  width: 100%;
  position: absolute;
  bottom: 0;
  background: linear-gradient(
    0deg,
    hsla(var(--palette-gray-95), 80%) 0%,
    hsla(var(--palette-gray-95), 32%) 70%,
    hsla(var(--palette-gray-95), 0%) 100%
  );
  color: hsl(var(--palette-gray-00));
  z-index: 2;
  padding: 0.75rem 1rem;

  @media screen and (min-width: 600px) {
    padding: 1rem 2rem;
  }
`;

const DishName = styled.h4`
  margin: 0 0 1rem 0;
  font-weight: 400;

  font-size: 1.25rem;

  @media screen and (min-width: 600px) {
    font-size: 1.5rem;
  }
`;

const DishStatLine = styled.span`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;

  font-size: 0.9rem;

  @media screen and (min-width: 600px) {
    font-size: 1rem;
  }
`;

const IconStat = styled.span`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const MaxWidthTagSelect = styled(TagSelect)`
  max-width: 300px;
`;

const DishCard = ({ id, name, cookTime, diet, s3Url, tags }: Props) => {
  const { t } = useTranslation("common");
  return (
    <Link href={`/r/${id}`} passHref>
      <StyledCard>
        <ImageContainer>
          <DishImage
            s3Url={s3Url}
            layout="fill"
            objectFit="cover"
            quality={80}
            sizes="(max-width: 600px) 200px, (max-width: 1200px) 400px, (max-width: 1800px) 500, (max-width: 2400px) 600px, (min-width: 2401px) 700px"
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
                size={1}
                title={t("preparationTime.label")}
              />
              <span>
                {t("preparationTime.inMinutes", { minutes: cookTime })}
              </span>
            </IconStat>
            <IconForDiet id={`diet_${id}`} diet={diet} />
            <MaxWidthTagSelect values={tags} onlyShow instanceId={`id`} />
          </DishStatLine>
        </DishStats>
      </StyledCard>
    </Link>
  );
};

export default DishCard;
