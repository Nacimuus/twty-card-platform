export type AIBackgroundType = "solid" | "gradient" | "image" | "texture";

export type AIButtonEffect =
  | "none"
  | "glow"
  | "neon"
  | "shine"
  | "glass";

export type AITheme = {
  name: string;

background: {
  type: AIBackgroundType;
  value: string;
  overlay?: string;
  texture?: "none" | "grain" | "luxury" | "carbon" | "marble" | "mesh" | "paper";
};

  card: {
    background: string;
    border: string;
    shadow: string;
    radius: string;
  };

  text: {
    nameColor: string;
    titleColor: string;
    bioColor: string;
    labelColor: string;
  };

  buttons: {
    background: string;
    color: string;
    shadow: string;
    effect: AIButtonEffect;
  };

  effects: {
    sparkles: boolean;
    glass: boolean;
    animatedGradient: boolean;
    floatingOrbs: boolean;
    noiseTexture: boolean;
  };
  iconStyle: "minimal" | "luxury" | "neon" | "glass";

animation: {
  intro: "fade" | "curtain" | "scale" | "reveal";
};
};

export const defaultAITheme: AITheme = {
  name: "Elegant Default",

background: {
  type: "gradient",
  value:
    "linear-gradient(135deg, #0f172a 0%, #1e293b 45%, #020617 100%)",
  overlay: "rgba(15, 23, 42, 0.2)",
  texture: "grain",
},

  card: {
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.14)",
    shadow: "0 25px 80px rgba(15,23,42,0.45)",
    radius: "2rem",
  },

  text: {
    nameColor: "#ffffff",
    titleColor: "#e5e7eb",
    bioColor: "#cbd5e1",
    labelColor: "#94a3b8",
  },

  buttons: {
    background: "linear-gradient(135deg, #ffffff, #e5e7eb)",
    color: "#0f172a",
    shadow: "0 12px 35px rgba(255,255,255,0.18)",
    effect: "glow",
  },

  effects: {
    sparkles: false,
    glass: true,
    animatedGradient: false,
    floatingOrbs: true,
    noiseTexture: true,
  },

iconStyle: "glass",

animation: {
  intro: "fade",
},
};