import { Request, Response, NextFunction, RequestHandler } from 'express';
import { check, validationResult} from 'express-validator';

export const validateCountryCode: RequestHandler[] = [
    check('code')
        .isAlpha()
        .isLength({ min: 2, max: 3 })
        .withMessage('Invalid country code format.'),
    (req: Request, res: Response, next: NextFunction): void => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ errors: errors.array() });
            return; // Ensure function does not continue
        }
        next(); // Pass control to the next middleware
    },
];

export const validateSearchQuery: RequestHandler[] = [
    check('name').optional().isString().withMessage('Name must be a string.'),
    check('capital').optional().isString().withMessage('Capital must be a string.'),
    check('region').optional().isString().withMessage('Region must be a string.'),
    check('timezone').optional().isString().withMessage('Timezone must be a string.'),
    check('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer.'),
    check('limit').optional().isInt({ min: 1 }).withMessage('Limit must be a positive integer.'),
    ((req: Request, res: Response, next: NextFunction) => {
        //console.log('Query Params Validated:', req.query); // Debugging log
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            //console.log('Validation Errors:', errors.array()); // Log validation errors
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }) as RequestHandler,
];


export const validateCompareQuery: RequestHandler[] = [
    check('codes')
        .exists().withMessage('Codes parameter is required.')
        .custom((value: string) => { // Explicitly type value as string
            const countryCodes = value.split(',');
            if (countryCodes.length !== 2) {
                throw new Error('Please provide exactly two country codes separated by a comma.');
            }
            if (!countryCodes.every((code: string) => /^[A-Za-z]{2,3}$/.test(code))) {
                throw new Error('Each country code must be 2 or 3 alphabetic characters.');
            }
            return true;
        }),
    ((req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }) as RequestHandler, // Explicitly cast to RequestHandler
];
