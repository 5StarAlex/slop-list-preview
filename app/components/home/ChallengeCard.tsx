type ChallengeCardProps = {
  title: string;
  copy: string;
  reward: number;
  progress: number;
  total: number;
};

export default function ChallengeCard({ title, copy, reward, progress, total }: ChallengeCardProps) {
  const percent = Math.max(0, Math.min(100, (progress / total) * 100));

  return (
    <article className="slop-challenge-card">
      <div className="slop-challenge-card__top">
        <div>
          <strong>{title}</strong>
          <p>{copy}</p>
        </div>
        <span className="slop-coin-reward">{reward}</span>
      </div>
      <div className="slop-progress">
        <span className="slop-progress__fill" style={{ width: `${percent}%` }} aria-hidden="true" />
      </div>
      <span className="slop-progress__copy">
        {progress.toLocaleString()} / {total.toLocaleString()}
      </span>
    </article>
  );
}
