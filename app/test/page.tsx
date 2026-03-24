import Button from '@/ui/Button';
import { NavMenuCloseIcon } from '@/ui/icons/nav-menu-close';
import { NavMenuOpenIcon } from '@/ui/icons/nav-menu-open';
import { Copy, Headline } from '@/ui/Typography';

export default function TestPage() {
  return (
    <div>
      <Headline styleAs="h1" color="blue">Test heading 1</Headline>
      <Headline styleAs="h2" color="red">Test heading 2</Headline>
      <Headline styleAs="h3" color="green">Test heading 3</Headline>
      <Headline styleAs="h4" color="yellow">Test heading 4</Headline>
      <Headline styleAs="h5" color="offWhite">Test heading 5</Headline>
      <Headline styleAs="h6" color="gray">Test heading 6</Headline>
      <Headline styleAs="p" color="lightGray">Test paragraph</Headline>
      <Headline styleAs="brand" color="blue">Test brand</Headline>
      <Copy>Test paragraph</Copy>

      <Button variant="primary" label="Test button Primary" />
      <Button variant="secondary" label="Test button Secondary" />
      <Button variant="tertiary" label="Test button Tertiary" />
      <Button variant="iconOnly" label={<NavMenuOpenIcon />} />
      <Button variant="iconOnly" label={<NavMenuCloseIcon />} />
      <Button variant="iconOnly" label="Test button Icon Only with missing icon" />
      <Button variant="primary" label="Test button Label Hidden" labelHidden={true} />

    </div>
  );
}