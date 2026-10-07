type Props = {
  title: string;
  description: string;
  titleSize?: "lg" | "md";
};

export default function OnboardingHeading({
  title,
  description,
  titleSize = "lg",
}: Props) {
  return (
    <div className="flex flex-col items-center gap-2.5 text-center">
      <h1
        className={`font-bold text-ink ${
          titleSize === "lg" ? "text-4xl" : "text-[34px]"
        }`}
      >
        {title}
      </h1>
      <p className="text-lg font-medium text-ink-sub">{description}</p>
    </div>
  );
}
