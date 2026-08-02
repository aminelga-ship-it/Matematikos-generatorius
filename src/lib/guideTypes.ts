export type GuideBlock = {
  id: string;
  title: string;
  body?: string;
  children?: GuideBlock[];
};

export type GuideSection = {
  id: string;
  title: string;
  defaultOpen: boolean;
  blocks: GuideBlock[];
};

export type GenerationGuideContent = {
  pageTitle: string;
  pageIntro?: string;
  sections: GuideSection[];
};
