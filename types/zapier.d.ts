declare namespace JSX {
  interface IntrinsicElements {
    "zapier-workflow": React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
      "client-id"?: string;
      "theme"?: "light" | "dark";
      "sign-up-email"?: string;
      "sign-up-first-name"?: string;
      "sign-up-last-name"?: string;
      "intro-copy-display"?: "show" | "hide";
      "manage-zaps-display"?: "show" | "hide";
      "guess-zap-display"?: "show" | "hide";
      "app-search-bar-display"?: "show" | "hide";
      "template-ids"?: string;
    }, HTMLElement>;
  }
}
