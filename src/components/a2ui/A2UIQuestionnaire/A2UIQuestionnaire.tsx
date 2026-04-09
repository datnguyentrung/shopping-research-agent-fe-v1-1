import { useMemo, useRef, useState, type FormEventHandler } from "react";

import "./A2UIQuestionnaire.scss";

interface A2UIQuestionnaireProps {
  title: string;
  options: { id: string; label: string }[];
  allowMultiple?: boolean;
  onSubmit: (selectedIds: string | string[]) => void;
  onSkip?: () => void;
}

const MAX_OPTIONS = 4;

const hashString = (value: string): number => {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return hash >>> 0;
};

const pickDisplayOptions = (
  options: { id: string; label: string }[],
  title: string,
) => {
  if (options.length <= MAX_OPTIONS) {
    return options;
  }

  return options
    .map((option, index) => ({
      option,
      rank: hashString(`${title}|${option.id}|${option.label}|${index}`),
    }))
    .sort((left, right) => left.rank - right.rank)
    .slice(0, MAX_OPTIONS)
    .map(({ option }) => option);
};

export default function A2UIQuestionnaire({
  title,
  options,
  allowMultiple,
  onSubmit,
  onSkip,
}: A2UIQuestionnaireProps) {
  const displayedOptions = useMemo(
    () => pickDisplayOptions(options, title),
    [options, title],
  );
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [otherReason, setOtherReason] = useState("");
  const [isOtherReasonFocused, setIsOtherReasonFocused] = useState(false);
  const otherReasonInputRef = useRef<HTMLInputElement | null>(null);

  const hasSelection = selectedIds.length > 0;
  const trimmedOtherReason = otherReason.trim();
  const canSendOtherReason = trimmedOtherReason.length > 0;

  const handleOptionChange = (optionId: string) => {
    if (allowMultiple) {
      setSelectedIds((currentSelectedIds) =>
        currentSelectedIds.includes(optionId)
          ? currentSelectedIds.filter((selectedId) => selectedId !== optionId)
          : [...currentSelectedIds, optionId],
      );
      return;
    }

    setSelectedIds([optionId]);
    setOtherReason("");
    setIsOtherReasonFocused(false);
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();

    if (hasSelection) {
      onSubmit(allowMultiple ? selectedIds : selectedIds[0]);
      return;
    }

    if (canSendOtherReason) {
      onSubmit(trimmedOtherReason);
    }
  };

  const handleOtherReasonSubmit = () => {
    if (!canSendOtherReason) {
      return;
    }

    onSubmit(trimmedOtherReason);
  };

  const handleSkip = () => {
    if (onSkip) {
      onSkip();
      return;
    }

    onSubmit(allowMultiple ? [] : "");
  };

  const handleContinue = () => {
    onSubmit(allowMultiple ? selectedIds : selectedIds[0]);
  };

  const handleOtherReasonFocus = () => {
    setIsOtherReasonFocused(true);
  };

  const focusOtherReasonInput = () => {
    otherReasonInputRef.current?.focus();
  };

  const handleOtherReasonBlur = () => {
    if (!trimmedOtherReason) {
      setIsOtherReasonFocused(false);
    }
  };

  return (
    <div className="questionnaire">
      <h3 className="questionnaire-title">{title}</h3>
      <form className="questionnaire-form" onSubmit={handleSubmit}>
        <div className="questionnaire-options-grid">
          {displayedOptions.map((option) => (
            <label key={option.id} className="questionnaire-option">
              <input
                type={allowMultiple ? "checkbox" : "radio"}
                name="option"
                value={option.id}
                checked={selectedIds.includes(option.id)}
                onChange={() => handleOptionChange(option.id)}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>

        {hasSelection ? (
          <div className="questionnaire-actions questionnaire-actions--selected">
            <button
              type="button"
              className="questionnaire-continue"
              onClick={handleContinue}
            >
              Tiếp tục
            </button>
            <button
              type="button"
              className="questionnaire-skip"
              onClick={handleSkip}
            >
              Bỏ qua
            </button>
          </div>
        ) : (
          <div className="questionnaire-other-reason-wrap">
            <div
              className={`questionnaire-other-reason-field ${
                isOtherReasonFocused || canSendOtherReason
                  ? "questionnaire-other-reason-field--active"
                  : ""
              }`}
              onClick={focusOtherReasonInput}
            >
              <span
                className="questionnaire-other-reason-icon"
                aria-hidden="true"
              >
                ✎
              </span>
              <input
                ref={otherReasonInputRef}
                className="questionnaire-other-reason-input"
                type="text"
                placeholder="Lý do khác..."
                value={otherReason}
                onFocus={handleOtherReasonFocus}
                onBlur={handleOtherReasonBlur}
                onChange={(event) => setOtherReason(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleOtherReasonSubmit();
                  }
                }}
              />
              <button
                type="button"
                className={`questionnaire-other-reason-submit ${
                  isOtherReasonFocused || canSendOtherReason
                    ? "questionnaire-other-reason-submit--visible"
                    : ""
                }`}
                onClick={handleOtherReasonSubmit}
                aria-label="Gửi lý do khác"
              >
                ↑
              </button>
            </div>

            <div className="questionnaire-actions questionnaire-actions--idle">
              <button
                type="button"
                className="questionnaire-skip"
                onClick={handleSkip}
              >
                Bỏ qua
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
