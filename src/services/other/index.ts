import { Provider } from '@nestjs/common';
import { EntityVerifierService } from './entity-verifier.service';

export const OtherServices: Provider[] = [EntityVerifierService];

export { EntityVerifierService };
