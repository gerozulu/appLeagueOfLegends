import { useCallback } from "react";
import { generateBuildForChampion, generateBuildsForTeam } from "../services/buildGenerator";

export function useBuildGenerator(itemsRaw) {
  const buildForChampion = useCallback(
    (champion, opts) => generateBuildForChampion(champion, itemsRaw, opts),
    [itemsRaw]
  );

  const buildsForTeam = useCallback(
    (teamByRole) => generateBuildsForTeam(teamByRole, itemsRaw),
    [itemsRaw]
  );

  return { buildForChampion, buildsForTeam };
}